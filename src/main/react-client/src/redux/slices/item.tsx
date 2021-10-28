/* eslint-disable no-param-reassign */
import {
    createAsyncThunk,
    createSlice,
    PayloadAction,
    Reducer,
} from '@reduxjs/toolkit'
import UserService from '../../service/user-service'
import { IListItem } from '../../schemas'

type TSelectedListPayload = {
    parentId: string
    list: IListItem[]
    itemType: 'subMenu' | 'classification'
}
type TSelectedPayload = { parentId: string; item: IListItem }
type TMapItem = { key: string; value: IListItem[] }

interface itemSliceState {
    itemList: IListItem[] | []
    selected: IListItem | Record<string, never>
    listMap: TMapItem[] | Record<string, never>
    parentId: string | null
    url: string | null
    editing: boolean
    size: number
    hasItems: boolean
    loading: 'idle' | 'pending' | 'successful'
    itemType: 'subMenu' | 'classification'
}
const initialItemState: itemSliceState = {
    itemList: [],
    selected: {},
    listMap: {},
    url: null,
    parentId: null,
    editing: false,
    size: 0,
    hasItems: false,
    loading: 'idle',
    itemType: 'classification',
}

export const getLinkUrl = createAsyncThunk(
    'items/getUrl',
    async (link: string) => {
        const response = await UserService.getUrl(link)
        return response
    }
)

export const itemSlice = createSlice({
    name: 'items',
    initialState: initialItemState,
    reducers: {
        itemLoading: (
            state,
            action: PayloadAction<'idle' | 'pending' | 'successful'>
        ) => {
            state.loading = action.payload
        },
        selectedItemList: (
            state,
            action: PayloadAction<TSelectedListPayload>
        ) => {
            const { parentId, list, itemType } = action.payload
            state.itemList = list
            state.size = list.length
            state.parentId = parentId
            if (state.listMap[parentId] === null) {
                state.listMap[parentId] = list
            }
            state.loading = 'successful'
            // state.editing = true
            state.itemType = itemType
        },
        itemType: (
            state,
            action: PayloadAction<'subMenu' | 'classification'>
        ) => {
            state.itemType = action.payload
        },
        resetItemSelection: (state) => {
            state.itemList = []
            state.selected = {}
            state.listMap = {}
            state.parentId = null
            state.editing = false
            state.size = 0
            state.hasItems = false
            state.loading = 'idle'
            state.itemType = 'classification'
        },
        editingItems: (state, action: PayloadAction<boolean>) => {
            const currentSize = state.itemList.length
            state.size = currentSize
            state.editing = action.payload
        },
        selectedItem: (state, action: PayloadAction<TSelectedPayload>) => {
            const { parentId, item } = action.payload
            state.selected = item
            state.parentId = parentId
        },
        removeItem: (state, action: PayloadAction<string>) => {
            state.itemList = state.itemList.filter(
                ({ link }) => link !== action.payload
            )
            state.editing = false
            if (state.size > 0) {
                state.size -= 1
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getLinkUrl.pending, (state) => {
            state.loading = 'pending'
        })
        builder.addCase(
            getLinkUrl.fulfilled,
            (state, action: PayloadAction<string>) => {
                const url = action.payload
                state.url = url
                state.loading = 'successful'
                state.editing = false
            }
        )
    },
})
export const {
    itemLoading,
    selectedItemList,
    itemType,
    removeItem,
    selectedItem,
    editingItems,
    resetItemSelection,
} = itemSlice.actions

export default itemSlice.reducer as Reducer<typeof initialItemState>
