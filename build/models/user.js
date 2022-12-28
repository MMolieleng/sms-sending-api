"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
/**
{"_id":"6229db90f0d7319773e8a6df"},
"emailAddress":"mohale@africacode.academy",
"phoneNumber":"59111222",
"password":"$2b$10$8y.MuBap4UR5Y3HVuvoTb.mO7ERRalhxCJy59NHAdvcSN1Fl3J346",
"roles":["CUSTOMER"],
"account":{"apiKey":"J171OJOXQ5IOKAXA7127SEHAIP8BKO6Q","balance":{"$numberInt":"66"}},
"acceptedTerm":"true",
"country":"Lesotho"
}
**/
const userAccount = new mongoose_1.Schema({
    apiKey: {
        type: String,
    },
    balance: {
        type: Number,
    },
});
const userSchema = new mongoose_1.Schema({
    phoneNumber: {
        type: String,
        required: [true, "Phone number must not be empty"],
    },
    emailAddress: {
        type: String,
        unique: true,
        required: [true, "Email must not be empty"],
        validate: {
            validator: (email) => emailRegex.test(email),
            message: (props) => `${props.value} is not a valid email`,
        },
    },
    password: {
        type: String,
        required: [true, "Password must not be empty"],
    },
    acceptedTerm: {
        type: Boolean,
        required: [true, "You are required to accept the terms of service"],
    },
    role: {
        type: String,
        required: [false, "Name must not be empty"],
        default: "CUSTOMER",
        enum: ["CUSTOMER", "ADMIN", "SUPER_ADMIN"],
    },
    country: {
        type: String,
        required: [true, "Name must not be empty"],
        enum: ["Lesotho", "Botswana"],
    },
    account: {
        type: userAccount,
        default: () => ({}),
    },
}, { timestamps: true });
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
