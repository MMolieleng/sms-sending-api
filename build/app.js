"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
// Load .env file
const dotenv_1 = __importDefault(require("dotenv"));
const index_js_1 = __importDefault(require("./sms/index.js"));
const index_1 = __importDefault(require("./users/index"));
const escrow_1 = __importDefault(require("./escrow/"));
const SMSController_1 = __importDefault(require("./controller/sms/SMSController"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Load dotenv configs
dotenv_1.default.config();
app.use(express_1.default.json());
app.get("/users", async (req, res) => {
    const users = await SMSController_1.default.allUsers();
    console.log({ users });
    res.json({ users });
});
// For Sending SMS
app.use("/api/v1/send/sms", index_js_1.default);
// app.use("/api/v1/sms/cost", smsRoutes)
// User Routes
app.use("/api/v1/users", index_1.default);
// Escrow / Admin Routes
app.use("/api/v1/escrow", escrow_1.default);
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
    mongoose_1.default
        .connect(process.env.MONGO_URI || "")
        .then(() => console.log("Database Connected"))
        .catch((err) => console.error(err));
    console.log(`Example app listening on port ${port}`);
});
