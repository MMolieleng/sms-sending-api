import express from "express";

const smsRoutes = express.Router();

import { body } from "express-validator";
import User from "../models/user.js";

smsRoutes.use(async (req, res, next) => {
  console.log("Time : ", Date.now());
  const headers = req.headers;
  const { authorization } = headers;
  if (authorization) {
    const users = await User.find()
      .select("-password -account.apiKey")
      .populate("account");
    console.log({ users });
    if (users.authorization !== authorization.trim()) {
      console.error("Token not provided");
      res.status(401).json({ message: "Invalid authorization token" });
      return;
    }

    if (users.account.balance === 0) {
      res
        .status(422)
        .json({ message: "Your account does not have enough credits" });
      return;
    }
    next();
  }
  res.status(401).json({ message: "Authorization token not provided" });
});

smsRoutes.post(
  "/",
  body("message").isLength({ min: 1 }),
  body("to").isString().isLength(10),
  (req, res) => {
    const { message, to } = req.body;
    console.log({ message });
    console.log({ to });
    res.json({ message: "message", status: 200 }).status(201);
  }
);

export default smsRoutes;
