"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_js_1 = __importDefault(require("../models/user.js"));
class UserRepository {
    async findAllUsers() {
        return await user_js_1.default.find();
    }
    async findUserByPhoneNumber(phoneNumber) {
        return await user_js_1.default.findOne({ phoneNumber })
            .select("-password")
            .populate("account");
    }
    async findUserByEmailAddress(emailAddress) {
        return await user_js_1.default.findOne({ emailAddress })
            .select("-password")
            .populate("account");
    }
    async findUserByApiKey(apiKey) {
        return await user_js_1.default.findOne({ "account.apiKey": apiKey })
            .select("-password")
            .populate("account");
    }
    async findUserAccountByAPIKey(apiKey) {
        const dbResponse = await user_js_1.default.findOne({ "account.apiKey": apiKey })
            .select("-password")
            .populate("account");
        const account = dbResponse?.account;
        if (!account || !account.apiKey || !account.balance || account.apiKey === undefined || account.balance === undefined) {
            throw new Error("Account has missing data, please create a new account");
        }
        const accountDto = {
            apiKey: account.apiKey,
            balance: account.balance
        };
        return accountDto;
    }
    async updateAccountByApiKey(newAccountBalance, apiKey) {
        const updatedAccount = await user_js_1.default.findOneAndUpdate({ "account.apiKey": apiKey }, { $set: { "account.balance": newAccountBalance } }, { new: true, upsert: true });
        return updatedAccount;
    }
}
exports.default = new UserRepository;
