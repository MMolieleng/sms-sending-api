import UserRepository from "../repositories/UserRepository"

class UserService {

        constructor(private userRepository: any = UserRepository) {
                this.userRepository = userRepository
        }

        async getAllUsers() {
                return await this.userRepository.findAllUsers()
        }
}

export default UserService