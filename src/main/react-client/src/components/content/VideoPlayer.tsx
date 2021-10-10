/* eslint-disable react/prop-types */
import React, { FC, useEffect, useState, useCallback } from 'react'
import ReactPlayer from 'react-player'
import SyncLoader from 'react-spinners/SyncLoader'
import { PayloadAction } from '@reduxjs/toolkit'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { getLinkUrl } from '../../redux/slices/item'
import { IListItem } from '../../schemas'

const VideoPlayer: FC = () => {
    const { selected, loading, url } = useAppSelector((state) => state.item)
    const dispatch = useAppDispatch()
    const [signedLink, setSignedLink] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // const selectedItem: IListItem | Record<string, never> = selected

    // const getUrl = useCallback(() => {
    //     setIsLoading(true)
    //     dispatch(getLinkUrl(selected.link)).then((res: PayloadAction<any>) => {
    //         setSignedLink(res.payload)
    //         console.log(`SIGNED LINK ${res.payload}`)
    //         setIsLoading(false)
    //     })
    // }, [dispatch, selected])
    const isUrl = (value: unknown): value is string => {
        return !!value && !!(value as string)
    }
    useEffect(() => {
        if (url && isUrl(url) && loading !== 'successful') {
            // if (!isLoading && selected.link !== undefined) getUrl()
            setSignedLink(url)
        }
    }, [selected, dispatch, loading, isLoading, url])

    return (
        //     <div className="spinner">
        //         <SyncLoader />
        //     </div>
        // ) : (
        <div className="player">
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
