/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { useAppSelector } from '../hooks'

export const editState = {
    editingListItem: false,
    editingSubMenu: false,
    subMenusLoading: false,
}

const editSlice = createSlice({
    name: 'editNav',
    initialState: editState,
    reducers: {
        editingItem: (state, action) => {
            state.editingListItem = action.payload
        },
        editingSubMenu: (state, action) => {
            state.editingSubMenu = action.payload
        },
        subMenusLoading: (state, action) => {
            state.subMenusLoading = action.payload
        },
    },
})

export const { editingItem, editingSubMenu, subMenusLoading } =
    editSlice.actions
export const editReducer = editSlice.reducer

export default editSlice
