import React, { FC } from 'react'
import EditDataName from './EditDataName'
import DeleteButton from '../buttons/DeleteButton'
import { IClassification } from '../../schemas'
import ItemListDropdownContainer from '../edit-dropdowns/ItemListDropdownContainer'
import SubMenuDropdownContainer from '../edit-dropdowns/SubMenuDropdownContainer'
import { useAppSelector } from '../../redux/hooks'

interface Props {
    classification: IClassification
    hasSubMenu: boolean
    subMenuCount: number
}

const EditHeader: FC<Props> = ({
    classification,
    hasSubMenu,
    subMenuCount,
}) => {
    const { name, _id } = classification
    const { item } = useAppSelector((state) => state)

    return (
        <div className="edit___header">
            <h2 className="edit___header___text">
                {name && name.toUpperCase()}
            </h2>
            <div className="edit___drop-downs">
                {hasSubMenu && (
                    <SubMenuDropdownContainer subMenuCount={subMenuCount} />
                )}
                {item.loading === 'successful' && <ItemListDropdownContainer />}
            </div>
            <div className="edit___header___control">
                <EditDataName
                    id={_id}
                    currentName={name}
                    type="classification"
                />
                <DeleteButton id={_id} type="classification" title="Delete" />
            </div>
        </div>
    )
}

export default EditHeader
