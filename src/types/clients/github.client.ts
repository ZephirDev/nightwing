import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { GitHubSite } from "../sites/github.site";
import { Logger } from "../../logger";

export class GithubClient {
    private httpClient: AxiosInstance;

    constructor(
        private githubSite: GitHubSite,
    )
    {
        this.httpClient = axios.create({
            baseURL: githubSite.baseUrl,
        });
        this.httpClient.interceptors.request.use((request: InternalAxiosRequestConfig) => {
            Logger.debug(`[GITHUB] ${request.method} ${request.url}`);
            return request;
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