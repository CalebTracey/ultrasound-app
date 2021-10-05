/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

type TMapItem = { key: string; value: IListItem[] }
interface IListItem {
    name: string
    title: string
    link: string
}
interface itemSliceState {
    entities: IListItem[] | []
    selected: IListItem | Record<string, never>
    listMap: TMapItem[] | Record<string, never>
    editing: boolean
    size: number
    loading: 'idle' | 'pending' | 'successful'
}
const initialItemState: itemSliceState = {
    entities: [],
    selected: {},
    listMap: {},
    editing: false,
    size: 0,
    loading: 'idle',
}
export const newListEntity = createAsyncThunk(
    'items/addListEntity',
    async (data: TMapItem) => {
        return data
    }
)
export const itemSlice = createSlice({
    name: 'items',
    initialState: initialItemState,
    reducers: {
        getItems: (state) => {
            state.loading = 'pending'
        },
        selectedItem: (state, action: PayloadAction<IListItem>) => {
            state.selected = action.payload
        },
        selectedItemList: (state, action: PayloadAction<IListItem[]>) => {
            state.entities = action.payload
            state.size = action.payload.length
            state.loading = 'idle'
        },
        removeItem: (state, action: PayloadAction<string>) => {
            state.entities = state.entities.filter(
                ({ link }) => link !== action.payload
            )
        },
    },
    extraReducers: (builder) => {
        builder.addCase(newListEntity.pending, (state) => {
            state.loading = 'pending'
        })
        builder.addCase(newListEntity.fulfilled, (state, action) => {
            const mapItem = action.payload
            state.listMap[mapItem.key] = mapItem.value
            state.loading = 'idle'
        })
    },
})
export const {
    getItems,
    selectedItemList,
    removeItem,
    selectedItem,
    // addListEntity,
} = itemSlice.actions

export default itemSlice
