import { constants as HttpStatusCode } from "http2";
import express from "express";
import User from "../models/user.js";

const userRoutes = express.Router();

userRoutes.get("/", async (req, res) => {
  const users = await User.find().select("-password -account.apiKey");
  res.json({ message: "message", status: HttpStatusCode.HTTP_STATUS_OK, data: { users } }).status(HttpStatusCode.HTTP_STATUS_OK);
});

userRoutes.post("/", async (req, res) => {

  const { phoneNumber,
    emailAddress,
    password,
    acceptedTerm } = req.body

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
  }
  const foundUser = await User.findOne({ phoneNumber: phoneNumber });

  if (foundUser) {
    res.status(HttpStatusCode.HTTP_STATUS_CONFLICT).json({ message: "Account already exist", status: HttpStatusCode.HTTP_STATUS_CONFLICT })
  } else {
    const createdAccount = await User.create(user);
    res.statusCode(HttpStatusCode.HTTP_STATUS_OK).json({ message: "success", status: HttpStatusCode.HTTP_STATUS_OK, data: { user: createdAccount } });
  }
});

export default userRoutes;
