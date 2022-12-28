"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserRepository_js_1 = __importDefault(require("../../repositories/UserRepository.js"));
const SmsService_js_1 = __importDefault(require("../../service/SmsService.js"));
class SMSController {
    smsService;
    constructor() {
        this.smsService = new SmsService_js_1.default(UserRepository_js_1.default);
    }
    /**
     *
     * @param {string message to be send} text
     * @param {string phone number} toPhoneNumber
     */
    async sendSMS(text, to) {
        // this.smsService.findByApiKey()
        // this.smsService.findByApiKey(text, to)
    }
    async allUsers() {
        return this.smsService.getAllUsers();
    }
}
;
exports.default = new SMSController();
