/* eslint-disable no-param-reassign */
import {
    createAsyncThunk,
    createSlice,
    PayloadAction,
    Reducer,
} from '@reduxjs/toolkit'
import UserService from '../../service/user-service'
import { IListItem } from '../../schemas'

type TSelectedListPayload = { parentId: string; list: IListItem[] }
type TSelectedPayload = { parentId: string; item: IListItem }
type TMapItem = { key: string; value: IListItem[] }

interface itemSliceState {
    itemList: IListItem[] | []
    selected: IListItem | Record<string, never>
    listMap: TMapItem[] | Record<string, never>
    parentId: string | undefined
    editing: boolean
    size: number
    loading: 'idle' | 'pending' | 'successful'
}
const initialItemState: itemSliceState = {
    itemList: [],
    selected: {},
    listMap: {},
    parentId: undefined,
    editing: false,
    size: 0,
    loading: 'idle',
}

export const getLinkUrl = createAsyncThunk(
    'items/getUrl',
    async (link: string) => {
        const response = await UserService.getUrl(link)
        return response
    }
)

// export const selectedItemList = createAsyncThunk(
//     'items/selectedItemList',
//     async (payload: TSelectedListPayload) => {
//         return payload
//     }
// )

export const itemSlice = createSlice({
    name: 'items',
    initialState: initialItemState,
    reducers: {
        selectedItemList: (
            state,
            action: PayloadAction<TSelectedListPayload>
        ) => {
            const { parentId, list } = action.payload
            state.itemList = list
            state.size = list.length
            if (state.listMap[parentId] === null) {
                state.listMap[parentId] = list
            }
            state.loading = 'idle'
        },
        resetItemSelection: (state) => {
            state.selected = {}
            state.itemList = []
            state.parentId = undefined
            state.editing = false
            state.size = 0
            state.loading = 'idle'
        },
        editingItems: (state) => {
            state.editing = true
        },
        newListEntity: (state, action: PayloadAction<TMapItem>) => {
            const mapItem = action.payload
            state.listMap[mapItem.key] = mapItem.value
        },
        getItems: (state) => {
            state.loading = 'pending'
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
        },
    },
    extraReducers: (builder) => {
        builder.addDefaultCase((state) => {
            state.loading = 'idle'
        })
    },
    // extraReducers: (builder) => {
    //     builder.addCase(selectedItemList.pending, (state) => {
    //         state.loading = 'pending'
    //     })
    //     builder.addCase(
    //         selectedItemList.fulfilled,
    //         (state, action: PayloadAction<TSelectedListPayload>) => {
    //             const { parentId, list } = action.payload
    //             state.itemList = list
    //             state.size = list.length
    //             if (state.listMap[parentId] === null) {
    //                 state.listMap[parentId] = list
    //             }
    //             state.loading = 'idle'
    //         }
    //     )
    // },
})
export const {
    getItems,
    removeItem,
    selectedItem,
    newListEntity,
    editingItems,
    resetItemSelection,
    selectedItemList,
} = itemSlice.actions

export default itemSlice.reducer as Reducer<typeof initialItemState>
