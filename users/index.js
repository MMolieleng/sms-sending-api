import express from "express";
import User from "../models/user.js";

const userRoutes = express.Router();

userRoutes.get("/", async (req, res) => {
  const users = await User.find().select("-password -account.apiKey");
  res.json({ message: "message", status: 200, data: users }).status(200);
});

export default userRoutes;
