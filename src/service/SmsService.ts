import UserRepository from "../repositories/UserRepository";

class SmsService {

        constructor(private userRepository : any) {
                this.userRepository = userRepository ;
        }

        async getAllUsers() {
                return this.userRepository.findAllUsers();
        }

        async findByApiKey(apiKey : String) {
                const user = await this.userRepository.findByApiKey(apiKey)
                if (!user) {
                        throw new Error('Invalid api key');
                }
                return user;
        }

        async canSendSMS(user: any) {

        }

        async getNetworkCost(phoneNumber: String) {

        }

        /**
         * 
         * @param {string : message being send} text 
         * @param {string : phone number that we are sending to} to 
         * @param {object : {balance, apiKey} user object } user 
         */
        async sendSMS(text: String, to: String, user: any) {
                const networkCost = await this.getNetworkCost(to)
        }
}

export default SmsService;