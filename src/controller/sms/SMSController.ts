import express, { request, Request, Response } from "express"
import SmsService from "../../service/SmsService"
import twilio from "twilio";
import { AnyNsRecord } from "dns";


const SMSController = express.Router()
const smsService = new SmsService();

SMSController.post("/", async (request: Request, response: Response) => {
        console.log("hiiiit")
        const { message, to } = request.body
        const { authorization } = request.headers

        if (!authorization) {
                throw new Error("API key not provided")
        }

        if (!message) {
                response.status(400).json({ message: "message field not provided" })
                return
        }

        if (!to) {
                response.status(400).json({ message: "to field which is phone number" })
                return
        }

        const responseData = await smsService.sendSMS(message.trim(), to.trim(), authorization.trim());

        if (responseData && responseData.error) {
                response.status(400).json(responseData)
                return;
        }
        response.status(200).json(responseData)
        return;
})


SMSController.get("/lookup/:phoneNumber", async (request: Request, response: Response) => {
        const { phoneNumber } = request.params

        const ACC_SID = "AC00c65b79fc6ae882aa45d73ccefda3fe";
        const AUTH_TOKEN = "6078d2500d7ef9e1016878d65c4d0788"
        const client = twilio(ACC_SID, AUTH_TOKEN);

        const res = await client.lookups.v2.phoneNumbers(phoneNumber)
                .fetch()

        response.send(res)

})


SMSController.post("/test", async (request: Request, response: Response) => {

})


export default SMSController