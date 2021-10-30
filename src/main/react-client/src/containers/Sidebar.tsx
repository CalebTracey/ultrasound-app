/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */

import React, { FC, useEffect, useState } from 'react'
import {
    ProSidebar,
    Menu,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
} from 'react-pro-sidebar'
import ClassificationList from '../components/sidebar/ClassificationList'
import eventBus from '../common/EventBus'

const Sidebar: FC = () => {
    const [editState, setEditState] = useState(true)

    useEffect(() => {
        const toggle = () => setEditState(!editState)

        const ac = new AbortController()

        eventBus.on('toggleEdit', ac, () => {
            toggle()
        })
        return () => {
            ac.abort()
            eventBus.remove('toggleEdit', toggle)
        }
    }, [editState])

    return (
        <div className="sidebar">
            <ProSidebar>
                <div className="sidebar___header">
                    <SidebarHeader style={{ display: 'flex' }}>
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
