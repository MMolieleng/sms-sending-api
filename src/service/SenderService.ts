import axios, { Axios, AxiosError } from "axios";
import { PanaceaResponseDto } from "../dto/PanaceaResponseDto";


class SenderService {
        constructor(private api: Axios = axios) {
                this.api = api
        }

        async sendWithPanacea(text: String, to: String): Promise<PanaceaResponseDto> {

                try {
                        const params = {
                                action: "message_send",
                                username: process.env.P_USERNAME,
                                password: process.env.P_PASSWORD,
                                text: text,
                                to: to,
                                from: "Fire SMS",
                                // report_url: reportUrl,
                                // report_mask: mask,
                        };
                        const mURL = `https://api.panaceamobile.com/json`;
                        const response = await this.api.get(mURL, { params });
                        const downstream = response.data as PanaceaResponseDto;
                        console.info("Panacea Downstream : ", { downstream });
                        return downstream

                } catch (error: Error | AxiosError | any) {

                        console.error({ error })
                        throw new Error(error)
                }
        }
}

export default new SenderService()