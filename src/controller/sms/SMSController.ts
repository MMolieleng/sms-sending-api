import express, { Request, Response } from "express"
import SmsService from "../../service/SmsService"


const SMSController = express.Router()
const smsService = new SmsService();

SMSController.post("/", async (request: Request, response: Response) => {
        const { message, to } = request.body
        const { authorization } = request.headers

        console.log({ authorization })

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

        response.json(responseData).status(201)
        return;
})
export default SMSController