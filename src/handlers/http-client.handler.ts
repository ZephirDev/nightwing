import axios, { AxiosInstance, AxiosResponse, CreateAxiosDefaults, InternalAxiosRequestConfig } from "axios";
import { Logger } from "../logger";

export default new class {

    create<Type=any>(config: CreateAxiosDefaults<Type>): AxiosInstance
    {
        const httpClient = axios.create(config);

        httpClient.interceptors.request.use((request: InternalAxiosRequestConfig) => {
            Logger.debug(`[${request.method}] ${request.baseURL}${request.url}`);
            return request;
        });

        httpClient.interceptors.response.use((response: AxiosResponse) => {
            Logger.debug(`[${response.config.method}] [status=${response.status}] ${response.config.baseURL}${response.config.url}`);
            return response;
        });

        return httpClient;
    }

};
