const express = require("express");
const User = require("../models/user");
const router = express.Router();

router.get("/", async (req, res) => {
  const users = await User.find().select("-password -account.apiKey");
  res.json({ message: "message", status: 200, data: users }).status(200);
});

module.exports = router;
