import React, { FC, useState } from 'react'
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap'
import { FiInfo } from 'react-icons/fi'
import { IListItem } from '../schemas'

interface Props {
    item: IListItem
}

const DetailsPopover: FC<Props> = ({ item }) => {
    const [popoverOpen, setPopOverOpen] = useState(false)

    const toggle = () => setPopOverOpen((prevState) => !prevState)

    return (
        <>
            <button
                id="info"
                type="button"
                className="btn btn-outline-secondary menu-button"
                onClick={toggle}
            >
                <big>
                    <FiInfo />
                </big>
            </button>
            <Popover
                placement="bottom"
                isOpen={popoverOpen}
                target="info"
                toggle={toggle}
            >
                <PopoverHeader>
                    <span className="span-header___capital">{item.name}</span>
                </PopoverHeader>
                <PopoverBody>
                    <span className="span-text___bold">
                        File name: <br />
                    </span>
                    <span className="span-text___light">{item.link}</span>
                </PopoverBody>
            </Popover>
        </>
    )
}

export default DetailsPopover
