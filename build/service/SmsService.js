"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserRepository_1 = __importDefault(require("../repositories/UserRepository"));
class SmsService {
    userRepository;
    constructor(userRepository = UserRepository_1.default) {
        this.userRepository = userRepository;
        this.userRepository = userRepository;
    }
    async getAllUsers() {
        return this.userRepository.findAllUsers();
    }
    async findByApiKey(apiKey) {
        const user = await this.userRepository.findByApiKey(apiKey);
        if (!user) {
            throw new Error('Invalid api key');
        }
        return user;
    }
    async canSendSMS(user) {
    }
    async getNetworkCost(phoneNumber) {
    }
    /**
     *
     * @param {string : message being send} text
     * @param {string : phone number that we are sending to} to
     * @param {object : {balance, apiKey} user object } user
     */
    async sendSMS(text, to, user) {
        const networkCost = await this.getNetworkCost(to);
    }
}
exports.default = SmsService;
