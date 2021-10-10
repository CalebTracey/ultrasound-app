/* eslint-disable no-param-reassign */
import {
    createAsyncThunk,
    createSlice,
    PayloadAction,
    Reducer,
} from '@reduxjs/toolkit'
import UserService from '../../service/user-service'
import { IListItem } from '../../schemas'
import { api } from '../../service/api'

type TSelectedListPayload = {
    parentId: string
    list: IListItem[]
    itemType: 'subMenu' | 'classification'
}
type TEditPayload = { id: string; type: string; item: IListItem }
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

export const selectedItemList = createAsyncThunk(
    'items/selectedItemList',
    async (payload: TSelectedListPayload) => {
        return payload
    }
)

export const deleteItem = createAsyncThunk(
    'items/delete',
    async (payload: TEditPayload) => {
        const { id, type, item } = payload
        return api.post(`/delete/${type}/${id}`, item)
    }
)

export const itemSlice = createSlice({
    name: 'items',
    initialState: initialItemState,
    reducers: {
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
            state.editing = action.payload
        },
        newListEntity: (state, action: PayloadAction<TMapItem>) => {
            const mapItem = action.payload
            state.listMap[mapItem.key] = mapItem.value
        },
        getItems: (state) => {
            state.loading = 'pending'
        },
        selectedItem: (state, action: PayloadAction<TSelectedPayload>) => {
            console.log('selected')
            const { parentId, item } = action.payload
            state.selected = item
            state.parentId = parentId
        },
        removeItem: (state, action: PayloadAction<string>) => {
            state.itemList = state.itemList.filter(
                ({ link }) => link !== action.payload
            )
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
        builder.addCase(selectedItemList.pending, (state) => {
            state.loading = 'pending'
        })
        builder.addCase(
            selectedItemList.fulfilled,
            (state, action: PayloadAction<TSelectedListPayload>) => {
                const { parentId, list, itemType } = action.payload
                state.itemList = list
                state.size = list.length
                state.parentId = parentId
                if (state.listMap[parentId] === null) {
                    state.listMap[parentId] = list
                }
                state.loading = 'successful'
                state.itemType = itemType
            }
        )
        builder.addDefaultCase((state) => {
            state.itemList = []
            state.parentId = null
            state.editing = false
            state.size = 0
            state.itemType = 'classification'
        })
    },
})
export const {
    itemType,
    getItems,
    removeItem,
    selectedItem,
    newListEntity,
    editingItems,
    // selectedItemList,
    resetItemSelection,
} = itemSlice.actions

export default itemSlice.reducer as Reducer<typeof initialItemState>
