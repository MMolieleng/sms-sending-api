"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const UserRepository_1 = __importDefault(require("../repositories/UserRepository"));
const SenderService_1 = __importDefault(require("./SenderService"));
class SmsService {
    userRepository;
    constructor(userRepository = UserRepository_1.default) {
        this.userRepository = userRepository;
        this.userRepository = userRepository;
    }
    async findByApiKey(apiKey) {
        const user = await this.userRepository.findUserByApiKey(apiKey);
        if (!user) {
            throw new Error('Invalid api key');
        }
        return user;
    }
    async getUserAccountByApiKey(apiKey) {
        const user = await this.userRepository.findUserByApiKey(apiKey);
        const userAccount = user?.account;
        if (!userAccount || !userAccount.apiKey || !userAccount.balance) {
            throw new Error("Invalid api key provided");
        }
        return { apiKey: userAccount.apiKey, balance: userAccount.balance };
    }
    async getNetworkCost(toPhoneNumber) {
        const params = {
            action: "route_check_price",
            username: process.env.P_USERNAME,
            password: process.env.P_PASSWORD,
            to: toPhoneNumber
        };
        const mURL = `https://api.panaceamobile.com/json`;
        const response = await axios_1.default.get(mURL, { params });
        const { data } = response;
        const { status, message, details: { cost, reason } } = data;
        return { status, message, cost, reason };
    }
    /**
     *
     * @param {string : message being send} text
     * @param {string : phone number that we are sending to} to
     * @param {object : {balance, apiKey} user object } user
     */
    async sendSMS(text, to, apiKey) {
        const smsCost = await this.getNetworkCost(to);
        const userAccount = await this.getUserAccountByApiKey(apiKey);
        console.log({ smsCost });
        console.log({ userAccount });
        if (smsCost.cost >= userAccount.balance) {
            return { message: `Insufficient funds, network cost = ${smsCost.cost}, your balance = ${userAccount.balance}`, error: true };
        }
        const accounts = { smsCost, userAccount };
        const sendMessageResponse = await this.send(text, to);
        console.info({ sendMessageResponse });
        if (sendMessageResponse && sendMessageResponse.message == "Sent") {
            const newAccountBalance = userAccount.balance.valueOf() - smsCost.cost.valueOf();
            const roundedNewBalance = Math.floor(newAccountBalance * 100) / 100;
            const updatedBalance = await this.userRepository.updateAccountByApiKey(roundedNewBalance, apiKey);
            if (updatedBalance) {
                return {
                    balance: updatedBalance.account.balance,
                    smsCost: smsCost.cost,
                    sendMessageResponse
                };
            }
        }
        return { accounts };
    }
    async send(text, to) {
        const downstreamResponse = await SenderService_1.default.sendWithPanacea(text, to);
        console.info({ downstreamResponse });
        return downstreamResponse;
    }
}
exports.default = SmsService;
