import { SubMenu, SidebarHeader } from 'react-pro-sidebar'
import React, { FC, useCallback, useRef, useEffect, useState } from 'react'
import { FiEdit3 } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { Badge } from 'reactstrap'
import { IClassification } from '../../schemas'
import SubMenuList from './SubMenuList'
import ListItemGroup from './ItemList'
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import {
    selectedClassification,
    editingClassification,
} from '../../redux/slices/classification'
import { editingSubMenu } from '../../redux/slices/subMenu'
import eventBus from '../../common/EventBus'
import { editingItems } from '../../redux/slices/item'
import CreateSubMenuButton from '../buttons/CreateSubMenuButton'

interface Props {
    classification: IClassification
}
const ClassificationItem: FC<Props> = ({ classification }) => {
    const { _id, name, hasSubMenu, listItems, subMenus } = classification
    const [width, setWidth] = useState('20rem')
    const { showEdit } = useAppSelector((state) => state.auth)
    const roles = useAppSelector((state) => state.auth.user?.roles)
    const dispatch = useAppDispatch()
    const ref = useRef(null)

    const isClassification = (value: unknown): value is IClassification => {
        return !!value && !!(value as IClassification)
    }

    const handleClassificationClick = useCallback(() => {
        if (ref.current) {
            if (isClassification(classification)) {
                dispatch(selectedClassification(classification)).then(() => {
                    eventBus.dispatch('updateItems')
                })
            }
        }
    }, [classification, dispatch])

    const handleEditClick = useCallback(() => {
        if (isClassification(classification)) {
            dispatch(editingClassification(true))
            dispatch(editingSubMenu(false))
            dispatch(editingItems(false))
            dispatch(selectedClassification(classification)).then(() => {
                eventBus.dispatch('updateItems')
            })
        }
    }, [classification, dispatch])

    useEffect(() => {
        if (showEdit) {
            setWidth('17rem')
        }
    }, [showEdit])
    return (
        <>
            <div style={{ display: 'flex' }}>
                {roles && roles.includes('ROLE_ADMIN') && showEdit && (
                    <button
                        key={`edit-button${_id}`}
                        type="button"
                        className="btn btn-outline-secondary menu-button"
                        onClick={handleEditClick}
                    >
                        <Link to={`/dashboard/admin/edit/${_id}`} />
                        <small>
                            <FiEdit3 />
                        </small>
                    </button>
                )}
                <SubMenu
                    ref={ref}
                    style={{
                        width,
                        // width: '100%',
                        fontWeight: 'bold',
                        // marginLeft: '15%',
                        zIndex: 1,
                        textTransform: 'uppercase',
                        paddingLeft: 0,
                    }}
                    id={`sm-id${_id}`}
                    key={`sm${_id}`}
                    title={name}
                    onClick={handleClassificationClick}
                >
                    {hasSubMenu && (
                        <>
                            <SidebarHeader
                                style={{
                                    // margin: '10px',
                                    lineHeight: '2rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                {roles &&
                                    roles.includes('ROLE_ADMIN') &&
                                    showEdit && <CreateSubMenuButton />}
                                <span
                                    style={{
                                        margin: '10px',
                                        fontSize: '14px',
                                    }}
                                    className="span-text___light"
                                >
                                    Submenus{'  '}
                                </span>
                                <Badge pill>
                                    {Object.keys(subMenus).length}
                                </Badge>
                            </SidebarHeader>
                            <SubMenuList
                                key={`sm-ig${_id}`}
                                subMenus={subMenus}
                            />
                        </>
                    )}
                    {listItems && (
                        <>
                            <SidebarHeader
                                style={{
                                    // margin: '10px',
                                    lineHeight: '2rem',
                                }}
                            >
                                <span
                                    style={{
                                        margin: '10px',
                                        fontSize: '14px',
                                    }}
                                    className="span-text___light"
                                >
                                    Scans{'  '}
                                </span>
                                <Badge pill>{listItems.length}</Badge>
                            </SidebarHeader>
                            <ListItemGroup
                                key={`l-ig${_id}`}
                                parentId={_id}
                                listItems={listItems}
                            />
                        </>
                    )}
                </SubMenu>
            </div>
        </>
    )
}

export default ClassificationItem
