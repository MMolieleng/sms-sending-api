"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class SenderService {
    api;
    constructor(api = axios_1.default) {
        this.api = api;
        this.api = api;
    }
    async sendWithPanacea(text, to) {
        try {
            const params = {
                action: "message_send",
                username: process.env.P_USERNAME,
                password: process.env.P_PASSWORD,
                text: text,
                to: to,
                from: "Fire SMS",
                // report_url: reportUrl,
                // report_mask: mask,
            };
            const mURL = `https://api.panaceamobile.com/json`;
            const response = await this.api.get(mURL, { params });
            const downstream = response.data;
            console.info("Panacea Downstream : ", { downstream });
            return downstream;
        }
        catch (error) {
            console.error({ error });
            throw new Error(error);
        }
    }
}
exports.default = new SenderService();
