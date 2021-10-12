import { SubMenu } from 'react-pro-sidebar'
import React, { FC, useCallback, useRef } from 'react'
import { FiEdit3 } from 'react-icons/fi'
import { Link, useHistory } from 'react-router-dom'
import { IClassification } from '../../schemas'
import SubMenuList from './SubMenuList'
import ListItemGroup from './ItemList'
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import {
    selectedClassification,
    editingClassification,
} from '../../redux/slices/classification'
import { resetItemSelection } from '../../redux/slices/item'
import { editingSubMenu } from '../../redux/slices/subMenu'

interface Props {
    classification: IClassification
}
const ClassificationItem: FC<Props> = ({ classification }) => {
    const { _id, name, hasSubMenu, listItems, subMenus } = classification
    const roles = useAppSelector((state) => state.auth.user?.roles)
    const { contentPath } = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch()
    const history = useHistory()
    const ref = useRef(null)

    const isClassification = (value: unknown): value is IClassification => {
        return !!value && !!(value as IClassification)
    }

    const handleClassificationClick = useCallback(() => {
        if (ref.current) {
            if (isClassification(classification)) {
                dispatch(selectedClassification(classification))
            }
        }
    }, [classification, dispatch])

    const handleEditClick = useCallback(() => {
        history.push(`${contentPath}/home`)
        if (isClassification(classification)) {
            // dispatch(resetItemSelection())
            dispatch(editingSubMenu(false))
            dispatch(editingClassification(true))
            dispatch(selectedClassification(classification))
        }
    }, [classification, dispatch, history, contentPath])

    return (
        <div style={{ display: 'flex' }}>
            {roles && roles.includes('ROLE_ADMIN') && (
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
                    width: '85%',
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
                    <SubMenuList key={`smig${_id}`} subMenus={subMenus} />
                )}
                {listItems && (
                    <ListItemGroup
                        key={`lig${_id}`}
                        parentId={_id}
                        listItems={listItems}
                    />
                )}
            </SubMenu>
        </div>
    )
}

export default ClassificationItem
