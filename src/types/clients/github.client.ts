import { AxiosInstance } from "axios";
import { GitHubSite } from "../sites/github.site";
import httpClientHandler from "../../handlers/http-client.handler";

export class GithubClient {
    private httpClient: AxiosInstance;

    constructor(
        private githubSite: GitHubSite,
    )
    {
        this.httpClient = httpClientHandler.create({
            baseURL: githubSite.baseUrl,
        });
    }

    async getTags(project: string): Promise<any[]>
    {
        const response = await this.httpClient.get(`/repos/${project}/tags`);
        if (200 !== response.status) {
            throw new Error(`Unable to get github tags of /repos/${project}/tags.`)
        }
        return response.data;
    }
    
}