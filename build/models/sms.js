"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const smsReport = new mongoose_1.Schema({
    to: {
        type: String,
    },
    message: {
        type: String,
    },
});
const smsMessage = new mongoose_1.Schema({
    to: {
        type: String,
    },
    text: {
        type: String,
    },
    from: {
        type: String,
    },
    reportUrl: {
        type: String,
    },
    reportMask: {
        type: Number,
    },
    messageStatus: {},
    messageId: {
        type: String,
    },
    report: {
        type: smsReport,
        default: () => ({}),
    },
}, { timestamps: true });
const SMSMessage = (0, mongoose_1.model)("smsMessage", smsMessage);
exports.default = SMSMessage;
