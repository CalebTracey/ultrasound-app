/* eslint-disable import/no-cycle */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import UserService from '../../service/user-service'
import { newListEntity } from './item'
import { AppDispatch } from '../store'

interface IListItem {
    name: string
    title: string
    link: string
}
interface ISubMenuObj {
    _id: string
    name: string
    itemList: IListItem[]
}
interface subMenuSliceState {
    selected: ISubMenuObj | Record<string, never>
    itemList: IListItem[] | []
    editing: boolean
    itemCount: number
    loading: 'idle' | 'pending' | 'successful'
}
const initialSubMenuState: subMenuSliceState = {
    selected: {},
    itemList: [],
    editing: false,
    itemCount: 0,
    loading: 'idle',
}
export const getOne = createAsyncThunk<
    ISubMenuObj,
    string,
    { dispatch: AppDispatch }
>('subMenu/getOne', async (id: string, thunkApi) => {
    const result = await UserService.getSubMenu(id)
    const newMapItem = { key: result._id, value: result.itemList }
    thunkApi.dispatch(newListEntity(newMapItem))
    return result
})

export const subMenuSlice = createSlice({
    name: 'subMenu',
    initialState: initialSubMenuState,
    reducers: {
        removeListItem: (state, action: PayloadAction<string>) => {
            state.itemList = state.itemList.filter(
                ({ link }) => link !== action.payload
            )
        },
        clearSubmenu: (state) => {
            state.selected = {}
            state.itemList = []
            state.editing = false
            state.itemCount = 0
            state.loading = 'idle'
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getOne.pending, (state) => {
            state.loading = 'pending'
        })
        builder.addCase(
            getOne.fulfilled,
            (state, action: PayloadAction<ISubMenuObj>) => {
                const subMenu = action.payload
                state.selected = subMenu
                state.itemCount = subMenu.itemList.length
                state.itemList = subMenu.itemList
                state.loading = 'successful'
            }
        )
    },
})
export const {
    // getSubMenu,
    // subMenuReceived,
    removeListItem,
} = subMenuSlice.actions

export default subMenuSlice
