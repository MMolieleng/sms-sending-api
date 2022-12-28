"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SmsService {
    userRepository;
    constructor(userRepository) {
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
