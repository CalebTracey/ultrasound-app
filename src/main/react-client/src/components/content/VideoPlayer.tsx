/* eslint-disable react/prop-types */
import React, { FC } from 'react'
import ReactPlayer from 'react-player'
import SyncLoader from 'react-spinners/SyncLoader'

import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import DetailsPopover from '../DetailsPopover'
import { IListItem, IAppUser } from '../../schemas'
import { newError } from '../../redux/slices/message'
import VideoDeleteButton from '../buttons/VideoDeleteButton'

const VideoPlayer: FC = () => {
    const { auth } = useAppSelector((state) => state)
    const { parentId, url, selected, editing } = useAppSelector(
        (state) => state.item
    )
    const dispatch = useAppDispatch()
    const isUrl = (value: unknown): value is string => {
        return !!value && !!(value as string)
    }
    const isItemList = (value: unknown): value is IListItem => {
        return !!value && !!(value as IListItem)
    }
    const isUser = (value: unknown): value is IAppUser => {
        return !!value && !!(value as IAppUser)
    }
    const isAdmin = isUser(auth.user) && auth.user.roles?.includes('ROLE_ADMIN')

    return isUrl(url) ? (
        <div className="video-page">
            <div className="video-page___header">
                {isAdmin && isItemList(selected) && parentId && auth.showEdit && (
                    <>
                        <VideoDeleteButton /> <DetailsPopover item={selected} />
                    </>
                )}

                <h2 className="video-page___title">
                    {!editing && selected.title}
                </h2>
            </div>
            {ReactPlayer.canPlay(url) ? (
                <div className="player">
                    <ReactPlayer
                        className="react-player"
                        url={url}
                        volume={0}
                        muted
                        playing
                        loop
                        width="85%"
                        height="85%"
                        controls
                    />
                </div>
            ) : (
                dispatch(newError('Error playing scan file'))
            )}
        </div>
    ) : (
        <div className="spinner">
            <SyncLoader />
        </div>
    )
}
export default VideoPlayer
