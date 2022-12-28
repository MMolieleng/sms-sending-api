"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http2_1 = require("http2");
const express_1 = __importDefault(require("express"));
const user_js_1 = __importDefault(require("../models/user.js"));
const userRoutes = express_1.default.Router();
userRoutes.get("/", async (req, res) => {
    const users = await user_js_1.default.find().select("-password -account.apiKey");
    res.json({ message: "message", status: http2_1.constants.HTTP_STATUS_OK, data: { users } }).status(http2_1.constants.HTTP_STATUS_OK);
});
userRoutes.post("/", async (req, res) => {
    const { phoneNumber, emailAddress, password, acceptedTerm } = req.body;
    const user = {
        phoneNumber: phoneNumber,
        emailAddress: emailAddress,
        password: password,
        acceptedTerm: acceptedTerm,
        role: "CUSTOMER",
        country: "Lesotho",
        account: {
            balance: 10,
            apiKey: nanoid()
        }
    };
    const foundUser = await user_js_1.default.findOne({ phoneNumber: phoneNumber });
    if (foundUser) {
        res.status(http2_1.constants.HTTP_STATUS_CONFLICT).json({ message: "Account already exist", status: http2_1.constants.HTTP_STATUS_CONFLICT });
    }
    else {
        const createdAccount = await user_js_1.default.create(user);
        res.statusCode(http2_1.constants.HTTP_STATUS_OK).json({ message: "success", status: http2_1.constants.HTTP_STATUS_OK, data: { user: createdAccount } });
    }
});
exports.default = userRoutes;
