import React, { FC } from 'react'
import { InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap'
import EditDataName from './EditDataName'
import { IClassification } from '../../schemas'
import ItemListDropdownContainer from '../edit-dropdowns/header/item/ItemListDropdownContainer'
import SubMenuDropdownContainer from '../edit-dropdowns/header/submenu/SubMenuDropdownContainer'
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
                {item.itemList.length !== 0 && <ItemListDropdownContainer />}
            </div>

            <div className="edit___header___control">
                <InputGroup>
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText>Edit Title</InputGroupText>
                    </InputGroupAddon>
                    <EditDataName
                        id={_id}
                        currentName={name}
                        type="classification"
                    />
                </InputGroup>
            </div>
        </div>
    )
}

export default EditHeader
