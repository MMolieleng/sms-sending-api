import express, { Request, Response } from "express"
import UserService from "../service/UsersService";

const userService = new UserService()

const UserController = express.Router();

UserController.get("/", async (request: Request, response: Response) => {
        const users = await userService.getAllUsers();
        response.json(users).status(201)
})

UserController.post("/", async (request: Request, response: Response) => {
        const { emailAddress, phoneNumber, password, acceptedTerm } = request.body

        if (!emailAddress || !phoneNumber || !password || !acceptedTerm) {
                response.json({ message: "Please provide all requred fields" })
                        .status(400)
                return
        }

        return await userService.getAllUsers();
})


export { UserController }