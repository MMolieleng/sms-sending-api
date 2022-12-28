"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
/*
{
        "status": 0,
        "message": "OK",
        "details": 193.24553
}
*/
const panaceaAccount = new mongoose_1.Schema({
    lastSync: {
        type: Date(),
    },
    balance: {
        type: String,
    },
});
