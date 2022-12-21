import { constants as HttpStatusCode } from "http2";
import express from "express";
import axios from "axios";

const escrowRoutes = express.Router();

escrowRoutes.get("/balance", async (req, res) => {

        const params = {
                action: "user_get_balance",
                username: process.env.P_USERNAME,
                password: process.env.P_PASSWORD,
        };

        const mURL = `https://api.panaceamobile.com/json`;
        const response = await axios.get(mURL, { params });
        const data = response.data;

        res.status(HttpStatusCode.HTTP_STATUS_OK).json({ balance: data })
})

export default escrowRoutes;