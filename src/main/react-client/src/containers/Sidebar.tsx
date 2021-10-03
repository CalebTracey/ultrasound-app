/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback } from 'react'
import SyncLoader from 'react-spinners/SyncLoader'
import { Button } from 'reactstrap'
import {
    ProSidebar,
    Menu,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
} from 'react-pro-sidebar'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import ClassificationList from '../components/sidebar/ClassificationList'
import EventBus from '../common/EventBus'
import allActions from '../redux/actions'
import { SET_MESSAGE } from '../redux/actions/types'
import '../components/custom.scss'

const Sidebar = (): JSX.Element => {
    const { user } = useAppSelector((state) => state.auth)
    const { message } = useAppSelector((state) => state.message)
    const { selectedVideo, selectedVideoTitle } = useAppSelector(
        (state) => state.data
    )
    const { classifications } = useAppSelector((state) => state.data)
    const [isLoading, setIsLoading] = useState(false)
    // const [dataBool, setDataBool] = useState(true)
    // const [retVal, setRetVal] = useState({});
    const dispatch = useAppDispatch()
    const { roles } = user

    // useEffect(() => {
    //     if (classifications.length === 0) {
    //         setIsLoading(true)
    //         // console.log(classifications)
    //         console.log('dispatch data')
    //         EventBus.dispatch('data')
    //     }
    //     setIsLoading(false)
    // }, [classifications])

    // const getClassificationData = useCallback(() => {
    //     if (!isLoading && dataBool) {
    //         setIsLoading(true)
    //         dispatch(allActions.edit.update())
    //             .then((res) => {
    //                 if (res === undefined) {
    //                     setDataBool(false)
    //                     dispatch(allActions.message.setMessage('No Data'))
    //                     setIsLoading(false)
    //                 } else {
    //                     setDataBool(true)
    //                     setIsLoading(false)
    //                 }
    //             })
    //             .catch((error) => {
    //                 const err =
    //                     (error.response &&
    //                         error.response.data &&
    //                         error.response.data.message) ||
    //                     error.message ||
    //                     error.toString()
    //                 dispatch({
    //                     type: SET_MESSAGE,
    //                     payload: err,
    //                 })

    //                 if (error.response && error.response.status === 401) {
    //                     EventBus.dispatch('logout')
    //                 }
    //             })
    //     }
    // }, [dataBool, dispatch, isLoading])

    // useEffect(() => {
    //     if (classifications !== undefined && !isLoading) {
    //         getClassificationData()
    //     }
    //     setDataBool(true)
    //     if (classifications !== undefined) {
    //         setIsLoading(false)
    //     }
    // }, [getClassificationData, classifications, isLoading])

    // const clickHandler = (subMenus) => {
    //   dispatch(allActions.user.subMenus(subMenus));
    //   // dispatch(allActions.user.subMenu(item.subMenu._id)
    // };
    const handleSubMenuChange = () => {
        if (selectedVideo) {
            dispatch(allActions.data.selectedVideo({}))
        }
        if (selectedVideoTitle) {
            dispatch(allActions.data.videoTitle(''))
        }
    }

    // const refresh = () => {
    //     setDataBool(true)
    // }

    // if (!isLoading) {
    //     return (
    //         <div className="sidebar">
    //             <div className="sidebar-content">
    //                 <ProSidebar width="16rem">
    //                     <SidebarHeader>
    //                         <p className="sidebar-header">Classifications</p>
    //                     </SidebarHeader>
    //                     <p className="sidebar-header">{message}</p>
    //                     {/* <Button color="primary" onClick={refresh}>
    //                         Retry
    //                     </Button> */}
    //                 </ProSidebar>
    //             </div>
    //         </div>
    //     )
    // }
    return (
        <div className="sidebar">
            <div className="sidebar-content">
                <ProSidebar width="16rem" onToggle={handleSubMenuChange}>
                    <SidebarHeader>
                        <p className="sidebar-header">Classifications</p>
                    </SidebarHeader>
                    <SidebarContent>
                        <Menu iconShape="square">
                            {classifications && (
                                <ClassificationList
                                    classifications={classifications}
                                />
                            )}
                        </Menu>
                    </SidebarContent>
                    <SidebarFooter>
                        <div className="sidebar-footer">
                            <footer>
                                <small>v0.5 {new Date().getFullYear()}</small>
                            </footer>
                        </div>
                    </SidebarFooter>
                </ProSidebar>
            </div>
        </div>
        // ) : (
        //     <div className="sidebar">
        //         <div className="sidebar-content">
        //             <ProSidebar width="16rem">
        //                 <SidebarHeader>
        //                     <p className="sidebar-header">Classifications</p>
        //                 </SidebarHeader>
        //                 <div className="spinner">
        //                     <SyncLoader />
        //                 </div>
        //             </ProSidebar>
        //         </div>
        //     </div>
        // )
    )
}

export default Sidebar
