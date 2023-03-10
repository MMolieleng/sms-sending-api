import express from "express";

import mongoose from "mongoose";
// Load .env file
import dotenv from "dotenv";

// Models

import escrowRoutes from "./escrow/";
import SMSController from "./controller/sms/SMSController";
import { UserController } from "./controller/UsersController";
import userRoutes from "./users";

const app = express();
const port = process.env.PORT;

// Load dotenv configs
dotenv.config();

app.use(express.json());

app.get("/api/v1/users", UserController)


// For Sending SMS
app.use("/api/v1/send/sms", SMSController);
// app.use("/api/v1/sms/cost", smsRoutes)


// Escrow / Admin Routes
app.use("/api/v1/escrow", escrowRoutes);

/**
 * This is for reports
 */
// TODO : Uncomment below code later
// app.post("/send", async (req, res) => {
//   return;
//   const { to, text } = req.body;

//   try {
//     const storedMessage = new SMSMessage({
//       to: to,
//       text: text,
//       reportMask: 31,
//       reportUrl: `https://firesms-sender-api.azurewebsites.net/receive-report?${shortid.generate()}`,
//     });

//     const downstreamResponse = await panaceaSender(
//       to,
//       text,
//       storedMessage.reportUrl,
//       storedMessage.reportMask
//     );

//     console.info({ downstreamResponse });

//     const sendMessage = await storedMessage.save();

//     res.status(201).json({ downstreamResponse, sendMessage });
//   } catch (error) {
//     console.error(error.message);
//     console.error({ error });
//     res.json({ message: "Message sending failed", to: to, text: text });
//   }
// });

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
    .connect(process.env.MONGO_URI || "")
    .then(() => console.log("Database Connected"))
    .catch((err) => console.error(err));
  console.log(`Example app listening on port ${port}`);
});
