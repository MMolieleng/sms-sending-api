import UserRepository from "../../repositories/UserRepository"
import SmsService from "../../service/SmsService.js"

class SMSController {
        constructor(private smsService: any = SmsService) {
                this.smsService = new SmsService(UserRepository)
        }

        /**
         * 
         * @param {string message to be send} text 
         * @param {string phone number} toPhoneNumber 
         */
        async sendSMS(text: string, to: string) {

                // this.smsService.findByApiKey()
                // this.smsService.findByApiKey(text, to)
        }

        async allUsers() {
                return this.smsService.getAllUsers()
        }
};

export default new SMSController()