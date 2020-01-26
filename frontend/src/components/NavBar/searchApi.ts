import {transport} from "../../api";

export const SearchApi = {
    async searchUser(query: string) {
        return await transport.get('/users/', {
            params: {query}
        });
    }
};