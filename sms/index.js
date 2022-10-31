const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  console.log("Time : ", Date.now());
  const headers = req.headers;

  const { authorization } = headers;
  if (authorization) {
    next();
  } else {
    res.status(401).json({ message: "Authorization token not provided" });
  }
});

router.post("/", (req, res) => {
  const { message, to } = req.body;
  console.log({ message });
  console.log({ to });
  res.json({ message: "message", status: 200 }).status(201);
});

module.exports = router;
