import axios from "axios";
import twilio from "twilio";
import { PhoneNumberInstance } from "twilio/lib/rest/lookups/v2/phoneNumber";
import UserAccountDto from "../dto/UserAccountDto";
import UserRepository from "../repositories/UserRepository";
import SenderService from "./SenderService";

class SmsService {

        constructor(private userRepository = UserRepository) {
                this.userRepository = userRepository;
        }

        async findByApiKey(apiKey: string) {
                const user = await this.userRepository.findUserByApiKey(apiKey)
                if (!user) {
                        throw new Error('Invalid api key');
                }
                return user;
        }

        async getUserAccountByApiKey(apiKey: string): Promise<UserAccountDto> {
                const user = await this.userRepository.findUserByApiKey(apiKey)
                const userAccount = user?.account

                if (!userAccount || !userAccount.apiKey || !userAccount.balance) {
                        throw new Error("Invalid api key provided")
                }

                return { apiKey: userAccount.apiKey, balance: userAccount.balance } as UserAccountDto
        }

        /**
         * This uses Twilio lookup API to validate phone numbers
         * Documentation https://www.twilio.com/docs/lookup/v2-api
         * @param phoneNumber 
         * @returns Boolean to indicate if the phone number is valid or not
         */
        async isValidPhoneNumber(phoneNumber: string): Promise<boolean> {
                console.log("Phovided Phone : ", { phoneNumber })

                const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
                const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

                const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

                const numberValidationResponse: PhoneNumberInstance = await client.lookups.v2.phoneNumbers(phoneNumber)
                        .fetch()

                console.info({ numberValidationResponse })
                return numberValidationResponse.valid
        }

        async getNetworkCost(toPhoneNumber: string): Promise<{ status: number, message: string, cost: number, reason: string }> {
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
        async sendSMS(text: string, to: string, apiKey: string) {

                const isValidNumber = await this.isValidPhoneNumber(to.valueOf());

                if (!isValidNumber) {
                        return { message: `Invalid phone number ${to}`, error: true }
                }

                const smsCost = await this.getNetworkCost(to);
                const userAccount = await this.getUserAccountByApiKey(apiKey);

                if (smsCost.cost >= userAccount.balance) {
                        return { message: `Insufficient funds, network cost = ${smsCost.cost}, your balance = ${userAccount.balance}`, error: true }
                }

                const accounts = { smsCost, userAccount }
                const sendMessageResponse = await this.send(text, to)

                console.info({ sendMessageResponse })

                if (sendMessageResponse && sendMessageResponse.message == "Sent") {
                        // TODO : Deduct profit margin
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

        private async send(text: string, to: string) {
                const downstreamResponse = await SenderService.sendWithPanacea(text, to)
                console.info({ downstreamResponse })
                return downstreamResponse;
        }
}

export default SmsService;