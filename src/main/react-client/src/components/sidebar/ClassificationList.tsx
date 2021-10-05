/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import { SubMenu } from 'react-pro-sidebar'
import React, { FC, useState } from 'react'
import { FiEdit3 } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import SubMenuItemGroup from './SubMenuItemGroup'
import ListItemGroup from './ListItemGroup'
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { selectedClassification } from '../../redux/slices/classification'

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
interface Props {
    classifications: IClassification[]
}

const ClassificationList: FC<Props> = ({ classifications }) => {
    const roles = useAppSelector((state) => state.auth.user?.roles)
    const dispatch = useAppDispatch()

    const handleClick = async (classification: IClassification) => {
        dispatch(selectedClassification(classification))
    }
    const classificationListNode = classifications.map(
        (classification: IClassification) => {
            const { subMenus, listItems, hasSubMenu } = classification
            return (
                <div style={{ display: 'flex' }}>
                    {roles && roles.includes('ROLE_ADMIN') && (
                        <button
                            key={`edit-button${classification._id}`}
                            type="button"
                            className="btn btn-outline-secondary menu-button"
                            onClick={() => handleClick(classification)}
                        >
                            <Link
                                to={`/dashboard/edit/${classification._id}`}
                            />
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
                        onClick={() => handleClick(classification)}
                    >
                        {hasSubMenu && (
                            <SubMenuItemGroup
                                key={`smig${classification._id}`}
                                subMenus={subMenus}
                            />
                        )}
                        {listItems && (
                            <ListItemGroup
                                key={`lig${classification._id}`}
                                listItems={listItems}
                                type="classification"
                            />
                        )}
                    </SubMenu>
                </div>
            )
        }
    )

    return <>{classificationListNode}</>
}

export default ClassificationList
