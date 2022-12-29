"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SmsService_1 = __importDefault(require("../../service/SmsService"));
const SMSController = express_1.default.Router();
const smsService = new SmsService_1.default();
SMSController.post("/", async (request, response) => {
    const { message, to } = request.body;
    const { authorization } = request.headers;
    console.log({ authorization });
    if (!authorization) {
        throw new Error("API key not provided");
    }
    if (!message) {
        response.status(400).json({ message: "message field not provided" });
        return;
    }
    if (!to) {
        response.status(400).json({ message: "to field which is phone number" });
        return;
    }
    const responseData = await smsService.sendSMS(message.trim(), to.trim(), authorization.trim());
    response.json(responseData).status(201);
    return;
});
exports.default = SMSController;
