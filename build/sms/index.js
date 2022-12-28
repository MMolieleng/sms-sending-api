"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http2_1 = require("http2");
const sender_js_1 = __importDefault(require("./sender.js"));
const express_validator_1 = require("express-validator");
const user_js_1 = __importDefault(require("../models/user.js"));
const smsRoutes = express_1.default.Router();
smsRoutes.use(async (req, res, next) => {
    console.log("Time : ", Date.now());
    const headers = req.headers;
    const { authorization } = headers;
    if (authorization) {
        // TODO : Do proper checks here
        const user = await user_js_1.default.findOne({ "account.apiKey": authorization })
            .select("-password")
            .populate("account");
        if (!user || !user.account || !user.account.apiKey) {
            res.status(401).json({ message: "Something went wrong while quering your account" });
            return;
        }
        if (user && user.account && user.account.apiKey !== authorization.trim()) {
            console.error("Token not provided");
            res.status(401).json({ message: "Invalid authorization token" });
            return;
        }
        if (user.account.balance === 0) {
            res
                .status(422)
                .json({ message: "Your account does not have enough credits" });
            return;
        }
        // At this point the user is authenticated and can send a message
        next();
    }
    else {
        res.status(401).json({ message: "Authorization token not provided" });
        res.end();
    }
});
smsRoutes.post("/", (0, express_validator_1.body)("message").isLength({ min: 1 }), (0, express_validator_1.body)("to").isString().isLength(10), async (req, res) => {
    const { message, to } = req.body;
    if (!message) {
        res.status(http2_1.constants.HTTP_STATUS_BAD_REQUEST).json({ message: "message field missing" });
        return;
    }
    if (!to) {
        res.status(http2_1.constants.HTTP_STATUS_BAD_REQUEST).json({ message: "to field missing" });
        return;
    }
    // Check if sms cost is good less than current balance
    const smsCost = await sender_js_1.default.routePrice(to.toString());
    if (!smsCost || !smsCost.cost) {
        res.json({ message: "Could not route the message", status: http2_1.constants.HTTP_STATUS_UNPROCESSABLE_ENTITY }).status(http2_1.constants.HTTP_STATUS_UNPROCESSABLE_ENTITY);
        return;
    }
    const headers = req.headers;
    const { authorization } = headers;
    const userAccount = await user_js_1.default.findOne({ "account.apiKey": authorization })
        .select("-password")
        .populate("account");
    console.log({ userAccount });
    console.log(`SMS Cost : ${smsCost.cost} \n User Account Balance : ${userAccount.account.balance}`);
    if (userAccount && smsCost.cost <= userAccount.balance) {
        console.info("Account balance : ", userAccount.balance);
        console.info("SMS Cost        : ", smsCost.cost);
        res.json({ message: "message", status: http2_1.constants.HTTP_STATUS_ACCEPTED }).status(http2_1.constants.HTTP_STATUS_ACCEPTED);
        return;
    }
    else {
        res.json({ message: "message was send", status: 200 }).status(201);
    }
});
exports.default = smsRoutes;
