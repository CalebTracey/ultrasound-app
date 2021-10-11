import React, { FC } from 'react'
import { Container } from 'reactstrap'
import EditSubMenuContainer from './EditSubMenuContainer'
import EditItemList from './EditListItem'
import { useAppSelector } from '../../redux/hooks'

interface Props {
    hasSubMenu: boolean
    editing: boolean
}
const EditContentPane: FC<Props> = ({ hasSubMenu, editing }) => {
    const { subMenu, item } = useAppSelector((state) => state)
    return (
        <Container fluid style={{ display: 'flex', padding: '2rem' }}>
            {hasSubMenu &&
                subMenu.editing &&
                subMenu.loading === 'successful' && <EditSubMenuContainer />}

            {editing && !subMenu.editing && item.editing && <EditItemList />}
        </Container>
    )
}

export default EditContentPane
