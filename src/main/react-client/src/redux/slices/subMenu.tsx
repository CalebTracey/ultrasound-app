/* eslint-disable import/no-cycle */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import {
    createAsyncThunk,
    createSlice,
    PayloadAction,
    Reducer,
} from '@reduxjs/toolkit'
import { itemType } from './item'
import { IListItem, ISubMenuObj } from '../../schemas'
import { api } from '../../service/api'
import { getOneClassification } from './classification'

type TNewSubMenu = { classification: string; name: string }
type TNewSubMenuLocation = {
    newParentId: string
    oldParentId: string
    item: IListItem
}
interface subMenuSliceState {
    selected: ISubMenuObj | Record<string, never>
    subMenuList: { [key: string]: ISubMenuObj } | Record<string, never>
    itemList: IListItem[] | []
    editing: boolean
    itemCount: number
    loading: 'idle' | 'pending' | 'successful'
}
const initialSubMenuState: subMenuSliceState = {
    selected: {},
    subMenuList: {},
    itemList: [],
    editing: false,
    itemCount: 0,
    loading: 'idle',
}

export const selectedSubMenu = createAsyncThunk(
    'subMenu/selected',
    async (subMenu: ISubMenuObj, thunkApi) => {
        const value: ISubMenuObj = subMenu
        thunkApi.dispatch(itemType('subMenu'))
        return value
    }
)

export const getOne = createAsyncThunk<ISubMenuObj, string>(
    'subMenu/getOne',
    async (id: string, thunkApi) => {
        const response = await api.get(`subMenu/${id}`).then((res) => {
            thunkApi.dispatch(selectedSubMenu(res.data))
            return res.data
        })
        return response
    }
)

export const createSubMenu = createAsyncThunk(
    'subMenu/create',
    async (data: TNewSubMenu, thunkApi) => {
        const response = await api.post(`subMenu/create`, data)
        thunkApi.dispatch(getOneClassification(data.classification))
        return response
    }
)

export const moveSubMenuItem = createAsyncThunk(
    'subMenu/move',
    async (data: TNewSubMenuLocation) => {
        const { oldParentId, newParentId, item } = data
        const response = await api.post(
            `/edit/subMenu/move/${oldParentId}/${newParentId}`,
            item
        )
        return response.data
    }
)

export const subMenuSlice = createSlice({
    name: 'subMenu',
    initialState: initialSubMenuState,
    reducers: {
        subMenuLoading: (
            state,
            action: PayloadAction<'idle' | 'pending' | 'successful'>
        ) => {
            state.loading = action.payload
        },
        resetSubMenuSelection: (state) => {
            state.selected = {}
            state.itemList = []
            state.editing = false
            state.itemCount = 0
            state.loading = 'idle'
        },
        editingSubMenu: (state, action: PayloadAction<boolean>) => {
            state.editing = action.payload
        },
        removeListItem: (state, action: PayloadAction<string>) => {
            state.itemList = state.itemList.filter(
                ({ link }) => link !== action.payload
            )
            state.selected.itemList = state.selected.itemList.filter(
                ({ link }) => link !== action.payload
            )
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getOne.pending, (state) => {
            state.loading = 'pending'
        })
        builder.addCase(selectedSubMenu.pending, (state) => {
            state.loading = 'pending'
        })
        builder.addCase(
            selectedSubMenu.fulfilled,
            (state, action: PayloadAction<ISubMenuObj>) => {
                const subMenu = action.payload
                state.selected = subMenu
                state.itemList = subMenu.itemList
                state.loading = 'successful'
                state.itemCount = subMenu.itemList.length
                state.editing = true
                if (state.subMenuList[subMenu._id] === undefined) {
                    state.subMenuList[subMenu._id] = subMenu
                }
            }
        )
    },
})
export const {
    subMenuLoading,
    removeListItem,
    resetSubMenuSelection,
    editingSubMenu,
} = subMenuSlice.actions

export default subMenuSlice.reducer as Reducer<typeof initialSubMenuState>
