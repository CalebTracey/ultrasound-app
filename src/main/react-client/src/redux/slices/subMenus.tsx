/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'

interface IListItem {
    name: string
    title: string
    link: string
}
interface ISubMenu {
    _id: string
    name: string
    itemList: IListItem[]
}
type SliceState = { selectedSubMenu: undefined } | { selectedSubMenu: ISubMenu }
const subMenuListAdapter = createEntityAdapter<ISubMenu>({
    selectId: (subMenu) => subMenu._id,
    sortComparer: (a, b) => a.name.localeCompare(b.name),
})

export const subMenuState = subMenuListAdapter.getInitialState({
    selectedSubMenu: undefined,
}) as SliceState

const subMenuSlice = createSlice({
    name: 'editNav',
    initialState: subMenuState,
    reducers: {
        setSelectedSubMenu(state, action) {
            state.selectedSubMenu = action.payload
        },
    },
})

export const { setSelectedSubMenu } = subMenuSlice.actions
export const subMenuReducer = subMenuSlice.reducer
export default subMenuSlice
