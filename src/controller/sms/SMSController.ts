import userRepository from "../../repositories/UserRepository.js"
import SmsService from "../../service/SmsService.js"

class SMSController {
        smsService : SmsService
        constructor() {
                this.smsService = new SmsService(userRepository)
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