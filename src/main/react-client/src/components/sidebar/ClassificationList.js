/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import { SubMenu } from 'react-pro-sidebar'
import React from 'react'
import { useDispatch } from 'react-redux'
import { FiEdit3 } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import SubMenuItemGroup from './SubMenuItemGroup'
import ListItemGroup from './ListItemGroup'
import allActions from '../../redux/actions'

const ClassificationList = ({
    roles,
    classifications,
    handleSubMenuChange,
}) => {
    const dispatch = useDispatch()
    const handleEditClick = (classification) => {
        handleSubMenuChange()
        dispatch(allActions.data.selectedEdit(classification))
    }
    const classificationListNode = classifications.map((classification) => {
        const { subMenus, listItems } = classification
        return (
            <div style={{ display: 'flex' }}>
                {roles && roles.includes('ROLE_ADMIN') && (
                    <button
                        key={`edit-button${classification._id}`}
                        type="button"
                        className="btn btn-outline-secondary menu-button"
                        onClick={() => handleEditClick(classification)}
                    >
                        <Link to={`/dashboard/edit/${classification._id}`} />
                        <small>
                            <FiEdit3 />
                        </small>
                    </button>
                )}
                <SubMenu
                    style={{
                        width: '85%',
                        // marginLeft: '15%',
                        textTransform: 'uppercase',
                        paddingLeft: 0,
                    }}
                    id={`sm-id${classification._id}`}
                    key={`sm${classification._id}`}
                    title={classification.name}
                >
                    <SubMenuItemGroup
                        key={`smig${classification._id}`}
                        subMenus={subMenus}
                    />
                    <ListItemGroup
                        key={`lig${classification._id}`}
                        listItems={listItems}
                    />
                </SubMenu>
            </div>
        )
    })

    return classificationListNode
}

export default ClassificationList
