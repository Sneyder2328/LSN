import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { HashTable } from "../../utils/utils"

export type TrendObject = {
    name: string;
    postsIds: Array<string>;
    offset?: string;
}
export type TrendsState = {
    entities: HashTable<TrendObject>
    listTrends: Array<string>;
}

const initialState: TrendsState = {
    entities: {},
    listTrends: []
}

export const trendsSlice = createSlice({
    name: 'trends',
    initialState,
    reducers: {
        loadTrendsSuccess: (state, action: PayloadAction<{ trends: Array<string> }>) => {
            const { trends } = action.payload
            state.listTrends = trends
        },
        loadPostsByTrendSuccess: (state, action: PayloadAction<{ name: string; postsIds: Array<string> }>) => {
            const {postsIds, name} = action.payload
            state.entities[name] = {
                name, postsIds
            }
        }
    }
})
export const trendsReducer = trendsSlice.reducer
export const trendsActions = trendsSlice.actions