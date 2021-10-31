/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */

import React, { FC } from 'react'
import {
    ProSidebar,
    Menu,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
} from 'react-pro-sidebar'
import ClassificationList from '../components/sidebar/ClassificationList'
import CreateClassificationButton from '../components/buttons/CreateClassificationButton'
import { useAppSelector } from '../redux/hooks'

const Sidebar: FC = () => {
    const { showEdit } = useAppSelector((state) => state.auth)

    return (
        <div className="sidebar">
            <ProSidebar>
                <div className="sidebar___header">
                    <SidebarHeader style={{ display: 'flex' }}>
                        {showEdit && <CreateClassificationButton />}
                        <p className="sidebar___header___text">
                            Classifications
                        </p>
                    </SidebarHeader>
                </div>
                <div className="sidebar___content">
                    <SidebarContent>
                        <Menu iconShape="square">
                            <ClassificationList />
                        </Menu>
                    </SidebarContent>
                </div>
                <div className="sidebar___footer">
                    <SidebarFooter>
                        <small>v0.6 {new Date().getFullYear()}</small>
                    </SidebarFooter>
                </div>
            </ProSidebar>
        </div>
    )
}

export default Sidebar
