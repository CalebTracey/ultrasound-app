/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'

interface IListItem {
    name: string
    title: string
    link: string
}
type SliceState =
    | { selectedItem: undefined; selectedItemList: undefined }
    | { selectedItem: IListItem; selectedItemList: IListItem[] }

const listItemAdapter = createEntityAdapter<IListItem>({
    selectId: (item) => item.link,
    sortComparer: (a, b) => a.name.localeCompare(b.name),
})

export const itemsState = listItemAdapter.getInitialState({
    selectedItem: undefined,
    selectedItemList: undefined,
}) as SliceState

const itemSlice = createSlice({
    name: 'items',
    initialState: itemsState,
    reducers: {
        setSelectedItem: (state, action) => {
            state.selectedItem = action.payload
        },
        setSelectedItemList: (state, action) => {
            state.selectedItemList = action.payload
        },
    },
})

export const { setSelectedItem, setSelectedItemList } = itemSlice.actions
export const itemsReducer = itemSlice.reducer

export default itemSlice
