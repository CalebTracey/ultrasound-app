/* eslint-disable import/no-cycle */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import {
    createAsyncThunk,
    createSlice,
    PayloadAction,
    Reducer,
} from '@reduxjs/toolkit'
import { selectedItemList } from './item'
import { IListItem, ISubMenuObj } from '../../schemas'
import { api } from '../../service/api'
import { editingClassification } from './classification'

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

const isSubMenuObj = (value: unknown): value is ISubMenuObj => {
    return !!value && !!(value as ISubMenuObj)
}

export const selectedSubMenu = createAsyncThunk(
    'subMenu/selected',
    async (subMenu: ISubMenuObj, thunkApi) => {
        const value: ISubMenuObj = subMenu
        const { _id, itemList, type } = value
        if (value && isSubMenuObj(value) && type === 'TYPE_SUBMENU') {
            if (itemList && itemList.length !== 0) {
                const listItems: IListItem[] = itemList
                thunkApi.dispatch(
                    selectedItemList({
                        parentId: _id,
                        list: listItems,
                    })
                )
            }
        }
        return value
    }
)

export const getOne = createAsyncThunk<ISubMenuObj, string>(
    'subMenu/getOne',
    async (id: string, thunkApi) => {
        const response = await api.get(`submenu/${id}`).then((res) => {
            return res.data
        })
        thunkApi.dispatch(selectedSubMenu(response))
        return response
    }
)

export const subMenuSlice = createSlice({
    name: 'subMenu',
    initialState: initialSubMenuState,
    reducers: {
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
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getOne.pending, (state) => {
            state.loading = 'pending'
            state.editing = false
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
                if (state.subMenuList[subMenu._id] === undefined) {
                    state.subMenuList[subMenu._id] = subMenu
                }
            }
        )
        builder.addDefaultCase((state) => {
            state.loading = 'idle'
            state.editing = false
        })
    },
})
export const { removeListItem, resetSubMenuSelection, editingSubMenu } =
    subMenuSlice.actions

export default subMenuSlice.reducer as Reducer<typeof initialSubMenuState>
