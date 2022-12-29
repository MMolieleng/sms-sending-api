import express, { Request, Response } from "express"
import UserService from "../service/UsersService";

const userService = new UserService()

const UserController = express.Router();

UserController.get("/", async (request: Request, response: Response) => {
        const users = await userService.getAllUsers();
        response.json(users).status(201)
})


export { UserController }