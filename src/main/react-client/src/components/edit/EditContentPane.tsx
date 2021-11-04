import React, { FC, useEffect } from 'react'
import { Container } from 'reactstrap'
import EditSubMenuContainer from './EditSubMenuContainer'
import EditItemList from './EditListItem'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import eventBus from '../../common/EventBus'
// RouteComponentProps
interface Props {
    hasSubMenu: boolean
    editing: boolean
}
const EditContentPane: FC<Props> = ({ hasSubMenu, editing }) => {
    const { classification, subMenu, item } = useAppSelector((state) => state)
    const { itemType } = item
    const dispatch = useAppDispatch()

    useEffect(() => {
        const timer = setTimeout(() => {
            eventBus.dispatch('updateItems')
        }, 10)
        return () => clearTimeout(timer)
    }, [classification, subMenu, item, itemType, dispatch])

    return (
        <Container
            fluid
            style={{
                display: 'flex',
                padding: '2rem',
                justifyContent: 'center',
            }}
        >
            {hasSubMenu &&
                subMenu.editing &&
                subMenu.loading === 'successful' && <EditSubMenuContainer />}

            {editing && !subMenu.editing && item.editing && <EditItemList />}
        </Container>
    )
}

export default EditContentPane
