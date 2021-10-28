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

const Sidebar: FC = () => {
    return (
        <div className="sidebar">
            <ProSidebar width="16rem">
                <div className="sidebar___header">
                    <SidebarHeader>
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
