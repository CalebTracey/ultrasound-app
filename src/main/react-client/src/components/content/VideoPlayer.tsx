/* eslint-disable react/prop-types */
import React, { FC } from 'react'
import ReactPlayer from 'react-player'
import SyncLoader from 'react-spinners/SyncLoader'
import { useAppSelector } from '../../redux/hooks'

const VideoPlayer: FC = () => {
    const { loading, url } = useAppSelector((state) => state.item)
    const isUrl = (value: unknown): value is string => {
        return !!value && !!(value as string)
    }
    return isUrl(url) && loading === 'successful' ? (
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
        <div className="spinner">
            <SyncLoader />
        </div>
    )
}
export default VideoPlayer
