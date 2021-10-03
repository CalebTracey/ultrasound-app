/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
import { MenuItem } from 'react-pro-sidebar'
import React, { FC } from 'react'
import allActions from '../../redux/actions'
import history from '../../helpers/history'
import { useAppDispatch } from '../../redux/hooks'
import allSlices from '../../redux/slices'

interface listItem {
    name: string
    title: string
    link: string
}
interface Props {
    listItems: listItem[]
}

const ListItemGroup: FC<Props> = ({ listItems }): JSX.Element => {
    const dispatch = useAppDispatch()

    const handleItemClick = (item: listItem) => {
        dispatch(allSlices.items.actions.setSelectedItem(item))
        dispatch(allSlices.edit.actions.editingItem(true))
        dispatch(allActions.data.videoTitle(item.title))
        dispatch(allActions.data.selectedVideo(item))
        history.push(`/dashboard/video/${item.name}`)
    }
    const subMenuGroup = listItems.map((item) => (
        <MenuItem
            key={item.link}
            title={item.name}
            onClick={() => handleItemClick(item)}
        >
            {item.name}
        </MenuItem>
    ))
    return <>{subMenuGroup}</>
}

export default ListItemGroup
