import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";
import { storageService } from "./storage.service.ts";

interface AdaptAxiosRequestConfig extends AxiosRequestConfig {
    headers: AxiosRequestHeaders;
}

export const axiosInstance = axios.create({ baseURL: "http://localhost:3100" });

axiosInstance.interceptors.request.use(( config: AdaptAxiosRequestConfig ) => {
    const accessToken = storageService.getAccessToken();

    if (accessToken) config.headers.setAuthorization(`Bearer ${ accessToken }`);

    return config;
});