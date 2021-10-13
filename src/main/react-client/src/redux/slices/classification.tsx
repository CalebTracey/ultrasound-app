/* eslint-disable import/no-cycle */
/* eslint-disable no-param-reassign */
import {
    createAsyncThunk,
    createSlice,
    PayloadAction,
    Reducer,
} from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
// import history from '../../helpers/history'
import { IClassification } from '../../schemas'
import { api } from '../../service/api'
import { newError } from './message'

interface classificationSliceState {
    entities: IClassification[] | []
    selected: IClassification | Record<string, never>
    editing: boolean
    subMenuCount: number
    listItemsCount: number
    loading: 'idle' | 'pending' | 'successful'
}
const initialClassificationState: classificationSliceState = {
    entities: [],
    selected: {},
    editing: false,
    subMenuCount: 0,
    listItemsCount: 0,
    loading: 'idle',
}

export const getAllClassifications = createAsyncThunk<IClassification[], void>(
    'classifications/getAll',
    async () =>
        api
            .get('classifications')
            .then((res) => {
                if (res.data !== undefined) {
                    return Promise.resolve(res.data)
                }
                return Promise.reject(res)
            })
            .catch((err: AxiosError) => {
                if (err.isAxiosError) {
                    newError(err.message)
                }
                Promise.reject(err)
            })
)

export const classificationSlice = createSlice({
    name: 'classifications',
    initialState: initialClassificationState,
    reducers: {
        selectedClassification: (
            state,
            action: PayloadAction<IClassification>
        ) => {
            const classification = action.payload
            state.selected = classification
            state.subMenuCount = Array.from(
                Object.keys(classification.subMenus)
            ).length
            state.listItemsCount = classification.listItems.length
            state.loading = 'successful'
        },
        editingClassification: (state, action: PayloadAction<boolean>) => {
            state.editing = action.payload
        },
        resetClassificationSelection: (state) => {
            state.selected = {}
            state.editing = false
            state.subMenuCount = 0
            state.listItemsCount = 0
            state.loading = 'idle'
        },
        setClassifications: (
            state,
            action: PayloadAction<IClassification[]>
        ) => {
            const classifications = action.payload
            state.entities = classifications
        },
        removeClassification: (state, action: PayloadAction<string>) => {
            state.entities = state.entities.filter(
                ({ _id }) => _id !== action.payload
            )
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getAllClassifications.pending, (state) => {
            state.loading = 'pending'
        })
        builder.addCase(
            getAllClassifications.fulfilled,
            (state, action: PayloadAction<IClassification[]>) => {
                state.entities = action.payload
                state.loading = 'idle'
            }
        )
    },
})
export const {
    selectedClassification,
    removeClassification,
    setClassifications,
    resetClassificationSelection,
    editingClassification,
} = classificationSlice.actions

export default classificationSlice.reducer as Reducer<
    typeof initialClassificationState
>
