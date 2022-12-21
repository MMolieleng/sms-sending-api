import express, { json } from "express";

import { mongoose } from "mongoose";
import shortid from "shortid";
// Load .env file
import dotenv from "dotenv";

// Models
import SMSMessage from "./models/sms.js";
import panaceaSender from "./sms/sender.js";
import smsRoutes from "./sms/index.js";
import userRoutes from "./users/index.js";
import escrowRoutes from "./escrow/index.js";

const app = express();
const port = process.env.PORT || 3000;

// Load dotenv configs
dotenv.config();

app.use(json());

// For Sending SMS
app.use("/api/v1/send/sms", smsRoutes);

// User Routes
app.use("/api/v1/users", userRoutes);


// Escrow / Admin Routes
app.use("/api/v1/escrow", escrowRoutes);

/**
 * This is for reports
 */
app.post("/send", async (req, res) => {
  const { to, text } = req.body;

  try {
    const storedMessage = new SMSMessage({
      to: to,
      text: text,
      reportMask: 31,
      reportUrl: `https://firesms-sender-api.azurewebsites.net/receive-report?${shortid.generate()}`,
    });

    const downstreamResponse = await panaceaSender(
      to,
      text,
      storedMessage.reportUrl,
      storedMessage.reportMask
    );

    console.info({ downstreamResponse });

    const sendMessage = await storedMessage.save();

    res.status(201).json({ downstreamResponse, sendMessage });
  } catch (error) {
    console.error(error.message);
    console.error({ error });
    res.json({ message: "Message sending failed", to: to, text: text });
  }
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
  // const DB_URL = await process.env.MONGO_URI;

  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Database Connected"))
    .catch((err) => console.error(err));
  console.log(`Example app listening on port ${port}`);
});
