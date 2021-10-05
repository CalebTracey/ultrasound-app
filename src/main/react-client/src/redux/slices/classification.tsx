/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import UserService from '../../service/user-service'

interface IListItem {
    name: string
    title: string
    link: string
}
interface ISubMenu {
    [key: string]: string
}
interface IClassification {
    _id: string
    name: string
    hasSubMenu: boolean
    listItems: IListItem[]
    subMenus: ISubMenu[]
}
interface classificationSliceState {
    entities: IClassification[] | []
    selected: IClassification | Record<string, never>
    editing: boolean
    size: number
    loading: 'idle' | 'pending' | 'successful'
}
const initialClassificationState: classificationSliceState = {
    entities: [],
    selected: {},
    editing: false,
    size: 0,
    loading: 'idle',
}
export const getAll = createAsyncThunk('classifications/getAll', async () => {
    return UserService.getClassifications()
})
export const classificationSlice = createSlice({
    name: 'classifications',
    initialState: initialClassificationState,
    reducers: {
        selectedClassification: (
            state,
            action: PayloadAction<IClassification>
        ) => {
            state.selected = action.payload
        },
        removeClassification: (state, action: PayloadAction<string>) => {
            state.entities = state.entities.filter(
                ({ _id }) => _id !== action.payload
            )
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getAll.pending, (state) => {
            state.loading = 'pending'
        })
        builder.addCase(getAll.fulfilled, (state, action) => {
            state.entities = action.payload
            state.loading = 'successful'
        })
    },
})
export const {
    selectedClassification,
    // startGetClassifications,
    // classificationsReceived,
    removeClassification,
} = classificationSlice.actions

export default classificationSlice
