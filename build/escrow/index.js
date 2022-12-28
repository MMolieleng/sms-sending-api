"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http2_1 = require("http2");
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const escrowRoutes = express_1.default.Router();
escrowRoutes.get("/balance", async (req, res) => {
    const params = {
        action: "user_get_balance",
        username: process.env.P_USERNAME,
        password: process.env.P_PASSWORD,
    };
    const mURL = `https://api.panaceamobile.com/json`;
    const response = await axios_1.default.get(mURL, { params });
    const data = response.data;
    res.status(http2_1.constants.HTTP_STATUS_OK).json({ balance: data });
});
exports.default = escrowRoutes;
