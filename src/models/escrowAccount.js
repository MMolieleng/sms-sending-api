import { model, Schema } from "mongoose";
/*
{
        "status": 0,
        "message": "OK",
        "details": 193.24553
}
*/
const panaceaAccount = new Schema({
        lastSync: {
                type: Date(),
        },
        balance: {
                type: String,
        },
});