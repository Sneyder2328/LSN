import { AxiosResponse } from "axios";
import { transport } from "../../api";

export const TrendsApi = {
    async fetchTrends(): Promise<AxiosResponse<Array<string>>> {
        return await transport.get('/trending/');
    },
    async getPostsByTrend(trend: string) {
        return await transport.get(`/trending/${trend}`)
    }
};