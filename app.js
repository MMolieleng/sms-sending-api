const { json } = require("express");
const express = require("express");
const { default: mongoose } = require("mongoose");
const shortid = require("shortid");

const SMSMessage = require("./models/sms");
const panaceaSender = require("./sms/sender");
const app = express();

const port = process.env.PORT || 3000;

// Load .env file
require("dotenv").config();

app.use(json());
app.use("/api/v1/send/sms", require("./sms/index"));
app.use("/api/v1/users", require("./users/index"));

app.get("/send", async (req, res) => {
  const { to, text } = req.body;
  const responseMsg = await panaceaSender(to, text);

  const storedMessage = new SMSMessage({
    to: to,
    text: text,
    reportMask: 31,
    report_url: `https://firesms-sender-api.azurewebsites.net/receive-report?${shortid.generate()}`,
  });

  const sendMessage = await storedMessage.save();

  res.json({ downstream: responseMsg, savedMessage: sendMessage });
});

app.post("/receive-report", (req, res) => {
  const { myMessageId, status } = req.query;

  console.log({ myMessageId });
  console.log({ status });
  console.log("SMS_STATUS : QUERY : ", JSON.stringify(req.query));
  console.log("SMS_STATUS : PARAMS : ", JSON.stringify(req.params));
  res.status(201).send("Status code received");
});

app.get("/status", (req, res) => {
  res.json({ status: "Ok" });
});

app.listen(port, async () => {
  const DB_URL = await process.env.MONGO_URI;
  console.log({ DB_URL });
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Database Connected"))
    .catch((err) => console.log(err));
  console.log(`Example app listening on port ${port}`);
});
