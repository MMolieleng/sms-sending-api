import express from "express";
import { constants as HttpStatusCode } from "http2";
import sender from "./sender.js"

import { body } from "express-validator";
import User from "../models/user.js";

const smsRoutes = express.Router();

smsRoutes.use(async (req, res, next) => {
  console.log("Time : ", Date.now());
  const headers = req.headers;
  const { authorization } = headers;
  if (authorization) {
    // TODO : Do proper checks here
    const user = await User.findOne({ "account.apiKey": authorization })
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
  } else {
    res.status(401).json({ message: "Authorization token not provided" });
    res.end()
  }
});

smsRoutes.post(
  "/",
  body("message").isLength({ min: 1 }),
  body("to").isString().isLength(10),
  async (req, res) => {
    const { message, to } = req.body;

    if (!message) {
      res.status(HttpStatusCode.HTTP_STATUS_BAD_REQUEST).json({ message: "message field missing" })
      return;
    }

    if (!to) {
      res.status(HttpStatusCode.HTTP_STATUS_BAD_REQUEST).json({ message: "to field missing" })
      return;
    }
    // Check if sms cost is good less than current balance
    const smsCost = await sender.routePrice(to.toString())
    if (!smsCost || !smsCost.cost) {
      res.json({ message: "Could not route the message", status: HttpStatusCode.HTTP_STATUS_UNPROCESSABLE_ENTITY }).status(HttpStatusCode.HTTP_STATUS_UNPROCESSABLE_ENTITY);
      return;
    }

    const headers = req.headers;
    const { authorization } = headers;
    const userAccount = await User.findOne({ "account.apiKey": authorization })
      .select("-password")
      .populate("account");

    console.log({ userAccount })
    console.log(`SMS Cost : ${smsCost.cost} \n User Account Balance : ${userAccount.account.balance}`)
    if (userAccount && smsCost.cost <= userAccount.balance) {
      console.info("Account balance : ", userAccount.balance)
      console.info("SMS Cost        : ", smsCost.cost)
      res.json({ message: "message", status: HttpStatusCode.HTTP_STATUS_ACCEPTED }).status(HttpStatusCode.HTTP_STATUS_ACCEPTED);
      return;
    }

    else {
      res.json({ message: "message was send", status: 200 }).status(201);
    }
  }
);

export default smsRoutes;
