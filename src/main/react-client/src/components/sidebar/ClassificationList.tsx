/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import { SubMenu } from 'react-pro-sidebar'
import React, { FC } from 'react'
import { FiEdit3 } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import SubMenuItemGroup from './SubMenuItemGroup'
import ListItemGroup from './ListItemGroup'
import allActions from '../../redux/actions'
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import allSlices from '../../redux/slices'

type TSubMenu = {
    key: string
    value: string
}
interface ISubMenu {
    [key: string]: string
}
interface IListItem {
    name: string
    title: string
    link: string
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

const ClassificationList: FC<Props> = ({ classifications }): JSX.Element => {
    const { roles } = useAppSelector((state) => state.auth.user)
    const dispatch = useAppDispatch()

    const handleEditClick = async (classification: IClassification) => {
        const { listItems } = classification
        dispatch(allSlices.items.actions.setSelectedItemList(listItems))
        dispatch(allActions.data.selectedEdit(classification))
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
                            onClick={() => handleEditClick(classification)}
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
                    >
                        {hasSubMenu && (
                            <SubMenuItemGroup
                                key={`smig${classification._id}`}
                                subMenus={subMenus}
                            />
                        )}
                        <ListItemGroup
                            key={`lig${classification._id}`}
                            listItems={listItems}
                        />
                    </SubMenu>
                </div>
            )
        }
    )

    return <>{classificationListNode}</>
}

export default ClassificationList
