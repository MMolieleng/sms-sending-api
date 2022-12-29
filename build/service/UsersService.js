"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserRepository_1 = __importDefault(require("../repositories/UserRepository"));
class UserService {
    userRepository;
    constructor(userRepository = UserRepository_1.default) {
        this.userRepository = userRepository;
        this.userRepository = userRepository;
    }
    async getAllUsers() {
        return await this.userRepository.findAllUsers();
    }
    async findUserByAccount(accountDto) {
        if (!accountDto || !accountDto.apiKey) {
            throw new Error("API token not provided");
        }
        return await this.userRepository.findUserByApiKey(accountDto.apiKey);
    }
}
exports.default = UserService;
