import { AxiosInstance } from "axios";
import httpClientHandler from "../../handlers/http-client.handler";
import { GoogleChatReport } from "../reports/googlechat.report";

export class GoogleChatClient {
    private httpClient: AxiosInstance;

    constructor(
        private googleChatReport: GoogleChatReport,
    )
    {
        this.httpClient = httpClientHandler.create({
            baseURL: googleChatReport.webhook,
        });
    }

    async sendMessage(title: string, body: string): Promise<void>
    {
        const response = await this.httpClient.post('', {
            cardsV2: [
                {
                    card: {
                        header: {
                            title,
                        },
                        sections: [{
                            widgets: [
                                {
                                    textParagraph: {
                                        text: body,
                                    }
                                }
                            ]
                        }]
                    }
                }
            ]
        });
        if (200 !== response.status) {
            throw new Error(`Unable to send message over google chat webhook.`)
        }
        return response.data;
    }
    
}