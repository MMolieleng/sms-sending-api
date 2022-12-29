
import UserAccountDto from "../dto/UserAccountDto"
import UserRepository from "../repositories/UserRepository"

class UserService {

        constructor(private userRepository = UserRepository) {
                this.userRepository = userRepository
        }

        async getAllUsers() {
                return await this.userRepository.findAllUsers()
        }

        async findUserByAccount(accountDto: UserAccountDto) {
                if (!accountDto || !accountDto.apiKey) {
                        throw new Error("API token not provided")
                }

                return await this.userRepository.findUserByApiKey(accountDto.apiKey)

        }
}

export default UserService