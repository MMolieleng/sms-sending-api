import axios from "axios";
import UserAccountDto from "../dto/UserAccountDto";
import UserRepository from "../repositories/UserRepository";
import SenderService from "./SenderService";

class SmsService {

        constructor(private userRepository = UserRepository) {
                this.userRepository = userRepository;
        }

        async findByApiKey(apiKey: String) {
                const user = await this.userRepository.findUserByApiKey(apiKey)
                if (!user) {
                        throw new Error('Invalid api key');
                }
                return user;
        }

        async getUserAccountByApiKey(apiKey: String): Promise<UserAccountDto> {
                const user = await this.userRepository.findUserByApiKey(apiKey)
                const userAccount = user?.account

                if (!userAccount || !userAccount.apiKey || !userAccount.balance) {
                        throw new Error("Invalid api key provided")
                }

                return { apiKey: userAccount.apiKey, balance: userAccount.balance } as UserAccountDto
        }

        async getNetworkCost(toPhoneNumber: String): Promise<{ status: Number, message: String, cost: Number, reason: String }> {
                const params = {
                        action: "route_check_price",
                        username: process.env.P_USERNAME,
                        password: process.env.P_PASSWORD,
                        to: toPhoneNumber
                };
                const mURL = `https://api.panaceamobile.com/json`;
                const response = await axios.get(mURL, { params });
                const { data } = response
                const { status, message, details: { cost, reason } } = data
                return { status, message, cost, reason };
        }

        /**
         * 
         * @param {string : message being send} text 
         * @param {string : phone number that we are sending to} to 
         * @param {object : {balance, apiKey} user object } user 
         */
        async sendSMS(text: String, to: String, apiKey: String) {
                const smsCost = await this.getNetworkCost(to);
                const userAccount = await this.getUserAccountByApiKey(apiKey);

                console.log({ smsCost })
                console.log({ userAccount })

                if (smsCost.cost >= userAccount.balance) {
                        return { message: `Insufficient funds, network cost = ${smsCost.cost}, your balance = ${userAccount.balance}`, error: true }
                }

                const accounts = { smsCost, userAccount }
                const sendMessageResponse = await this.send(text, to)

                console.info({ sendMessageResponse })

                if (sendMessageResponse && sendMessageResponse.message == "Sent") {
                        const newAccountBalance = userAccount.balance.valueOf() - smsCost.cost.valueOf();
                        const roundedNewBalance = Math.floor(newAccountBalance * 100) / 100
                        const updatedBalance = await this.userRepository.updateAccountByApiKey(roundedNewBalance, apiKey)

                        if (updatedBalance) {
                                return {
                                        balance: updatedBalance.account.balance,
                                        smsCost: smsCost.cost,
                                        sendMessageResponse
                                }
                        }
                }
                return { accounts }
        }

        private async send(text: String, to: String) {
                const downstreamResponse = await SenderService.sendWithPanacea(text, to)
                console.info({ downstreamResponse })
                return downstreamResponse;
        }
}

export default SmsService;