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
}

export default new UserRepository;