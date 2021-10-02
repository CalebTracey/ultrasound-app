/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { SubMenu } from 'react-pro-sidebar'
import { useDispatch } from 'react-redux'
import allActions from '../../redux/actions'
import ListItemGroup from './ListItemGroup'

const SubMenuComponent = ({ id, title }) => {
    const dispatch = useDispatch()
    const [items, setItems] = useState([])
    const [hasItems, setHasItems] = useState(false)

    const getItems = (i) =>
        dispatch(allActions.data.subMenu(i))
            .then(({ data }) => {
                setItems(data.itemList)
                setHasItems(true)
            })
            .catch((err) => {
                console.error(err)
            })

    return (
        <SubMenu
            // style={{ textTransform: 'uppercase' }}
            key={`sm${id}`}
            title={title}
            onClick={() => getItems(id)}
        >
            {hasItems && <ListItemGroup listItems={items} />}
        </SubMenu>
    )
}
SubMenuComponent.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
}

export default SubMenuComponent
