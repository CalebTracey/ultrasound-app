/* eslint-disable react/prop-types */
import React, { FC, useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import SyncLoader from 'react-spinners/SyncLoader'
import { PayloadAction } from '@reduxjs/toolkit'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { getLinkUrl } from '../../redux/slices/item'
import { IListItem } from '../../schemas'

const VideoPlayer: FC = () => {
    const { selected } = useAppSelector((state) => state.item)
    const dispatch = useAppDispatch()
    const [signedLink, setSignedLink] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const selectedItem: IListItem | Record<string, never> = selected

    useEffect(() => {
        setIsLoading(true)
        if (selectedItem !== undefined || selectedItem !== {}) {
            dispatch(getLinkUrl(selectedItem.link)).then(
                (res: PayloadAction<any>) => {
                    setSignedLink(res.payload)
                }
            )
            setIsLoading(false)
        }
    }, [selected, dispatch, selectedItem])

    return isLoading && signedLink ? (
        <div className="spinner">
            <SyncLoader />
        </div>
    ) : (
        <div className="player-wrapper">
            <ReactPlayer
                className="react-player"
                url={signedLink}
                volume={0}
                muted
                playing
                loop
                width="85%"
                height="85%"
                controls
            />
        </div>
    )
}
export default VideoPlayer
