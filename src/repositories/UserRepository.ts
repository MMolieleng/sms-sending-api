import UserAccountDto from "../dto/UserAccountDto.js";
import User from "../models/user.js";

class UserRepository {

        async findAllUsers() {
                return await User.find()
        }
        async findUserByPhoneNumber(phoneNumber: String) {
                return await User.findOne({ phoneNumber })
                        .select("-password")
                        .populate("account");
        }

        async findUserByEmailAddress(emailAddress: String) {
                return await User.findOne({ emailAddress })
                        .select("-password")
                        .populate("account");
        }

        async findUserByApiKey(apiKey: String) {
                return await User.findOne({ "account.apiKey": apiKey })
                        .select("-password")
                        .populate("account");
        }

        async findUserAccountByAPIKey(apiKey: String): Promise<UserAccountDto> {

                const dbResponse = await User.findOne({ "account.apiKey": apiKey })
                        .select("-password")
                        .populate("account");
                const account = dbResponse?.account
                if (!account || !account.apiKey || !account.balance || account.apiKey === undefined || account.balance === undefined) {
                        throw new Error("Account has missing data, please create a new account")
                }

                const accountDto: UserAccountDto = {
                        apiKey: account.apiKey,
                        balance: account.balance
                }
                return accountDto
        }

        async updateAccountByApiKey(newAccountBalance: Number, apiKey: String) {
                const updatedAccount = await User.findOneAndUpdate(
                        { "account.apiKey": apiKey },
                        { $set: { "account.balance": newAccountBalance } },
                        { new: true, upsert: true }
                );
                return updatedAccount

        }
}

export default new UserRepository;