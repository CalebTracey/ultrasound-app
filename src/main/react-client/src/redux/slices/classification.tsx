/* eslint-disable import/no-cycle */
/* eslint-disable no-param-reassign */
import {
    createAsyncThunk,
    createSlice,
    PayloadAction,
    Reducer,
} from '@reduxjs/toolkit'
import { selectedItemList } from './item'
import { IClassification } from '../../schemas'
import { api } from '../../service/api'

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

const isClassification = (value: unknown): value is IClassification => {
    return !!value && !!(value as IClassification)
}

export const selectedClassification = createAsyncThunk(
    'classifications/selected',
    async (classification: IClassification, thunkApi) => {
        const value: IClassification = classification
        const { _id, listItems, type } = value
        if (
            value &&
            isClassification(value) &&
            type === 'TYPE_CLASSIFICATION'
        ) {
            if (listItems && listItems.length !== 0) {
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

export const getAllClassifications = createAsyncThunk(
    'classifications/getAll',
    async () =>
        api.get('classifications').then((res) => {
            return res.data
        })
)

// export const editClassification = createAsyncThunk(
//     'classifications/editing',
//     async (classification: IClassification, thunkApi) => {
//         const retVal = await thunkApi.dispatch(
//             selectedClassification(classification)
//         )
//         return retVal.payload
//     }
// )

export const classificationSlice = createSlice({
    name: 'classifications',
    initialState: initialClassificationState,
    reducers: {
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
        builder.addCase(selectedClassification.pending, (state) => {
            state.loading = 'pending'
        })
        builder.addCase(
            selectedClassification.fulfilled,
            (state, action: PayloadAction<IClassification>) => {
                const classification = action.payload
                state.selected = classification
                state.subMenuCount = Array.from(
                    Object.keys(classification.subMenus)
                ).length
                state.listItemsCount = classification.listItems.length
                state.loading = 'idle'
            }
        )
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
        // builder.addCase(editClassification.fulfilled, (state) => {
        //     state.editing = true
        // })
        builder.addDefaultCase((state) => {
            state.loading = 'idle'
            state.editing = false
        })
    },
})
export const {
    removeClassification,
    setClassifications,
    resetClassificationSelection,
    editingClassification,
} = classificationSlice.actions

export default classificationSlice.reducer as Reducer<
    typeof initialClassificationState
>
