/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosResponse } from 'axios'
import { IListItem } from '../../schemas'
import { api } from '../../service/api'
import {
    getAllClassifications,
    resetClassificationSelection,
} from './classification'
import { resetItemSelection } from './item'
import { newMessage } from './message'

type TDeleteItemPayload = { id: string; type: string; item: IListItem }
type TDeleteDataPayload = {
    id: string
    type: string
}
type TDataNamePayload = { name: string }
type TDataNameProps = {
    id: string
    textValue: string
    type: string
}
type TItemNameProps = {
    id: string
    textValue: string
    item: IListItem
    type: string
}
interface editSliceState {
    loading: 'pending' | 'idle' | 'successful'
}

const initialSliceState: editSliceState = {
    loading: 'idle',
}

export const editDataName = createAsyncThunk(
    'edit/dataName',
    async (data: TDataNameProps, thunkApi) => {
        const { type, id, textValue } = data
        const newName = { name: textValue }
        api.post<TDataNamePayload, AxiosResponse>(
            `/edit/${type}/name/${id}`,
            newName
        ).then((res: AxiosResponse<string>) => {
            thunkApi.dispatch(getAllClassifications())
            thunkApi.dispatch(resetClassificationSelection())
            thunkApi.dispatch(newMessage(res.data))
        })
    }
)

export const editItemName = createAsyncThunk(
    'edit/itemName',
    async (data: TItemNameProps, thunkApi) => {
        const { type, id, item, textValue } = data
        const newName = { newName: textValue, link: item.link, name: item.name }
        api.post<TDataNamePayload, AxiosResponse>(
            `/edit/${type}/item/name/${id}`,
            newName
        ).then((res: AxiosResponse<string>) => {
            thunkApi.dispatch(getAllClassifications())
            thunkApi.dispatch(resetClassificationSelection())
            thunkApi.dispatch(resetItemSelection())
            thunkApi.dispatch(newMessage(res.data))
        })
    }
)

export const deleteData = createAsyncThunk(
    'items/delete',
    async (data: TDeleteDataPayload, thunkApi) => {
        const { id, type } = data
        api.delete<TDataNamePayload, AxiosResponse>(
            `/delete-data/${type}/${id}`
        ).then((res: AxiosResponse<string>) => {
            thunkApi.dispatch(getAllClassifications())
            thunkApi.dispatch(resetClassificationSelection())
            thunkApi.dispatch(newMessage(res.data))
        })
    }
)

export const deleteItem = createAsyncThunk(
    'items/delete',
    async (payload: TDeleteItemPayload, thunkApi) => {
        const { id, type, item } = payload
        api.post<IListItem, AxiosResponse>(
            `/delete-item/${type}/${id}`,
            item
        ).then((res: AxiosResponse<string>) => {
            thunkApi.dispatch(getAllClassifications())
            thunkApi.dispatch(resetClassificationSelection())
            thunkApi.dispatch(newMessage(res.data))
        })
    }
)

export const importData = createAsyncThunk('edit/import', async (_, thunkApi) =>
    api.delete('/tables/clear').then(() => {
        thunkApi.dispatch(newMessage('Data import success'))
        api.post('/S3/update/').then(() => {
            thunkApi.dispatch(getAllClassifications())
        })
    })
)

const editSlice = createSlice({
    name: 'edit',
    initialState: initialSliceState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(editDataName.pending, (state) => {
            state.loading = 'pending'
        })
        builder.addCase(editDataName.fulfilled, (state) => {
            state.loading = 'successful'
        })
    },
})

// export const { editingItem, editingSubMenu, subMenusLoading } =
//     editSlice.actions
export const editReducer = editSlice.reducer

export default editSlice.reducer
