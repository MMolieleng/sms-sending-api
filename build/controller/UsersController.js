"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const express_1 = __importDefault(require("express"));
const UsersService_1 = __importDefault(require("../service/UsersService"));
const userService = new UsersService_1.default();
const UserController = express_1.default.Router();
exports.UserController = UserController;
UserController.get("/", async (request, response) => {
    const users = await userService.getAllUsers();
    response.json(users).status(201);
});
