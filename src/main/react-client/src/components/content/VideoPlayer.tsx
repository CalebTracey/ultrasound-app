/* eslint-disable react/prop-types */
import React, { FC, useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import SyncLoader from 'react-spinners/SyncLoader'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import UserService from '../../service/user-service'

interface IListItem {
    name: string
    title: string
    link: string
}

const VideoPlayer: FC = () => {
    const { selected } = useAppSelector((state) => state.item)
    const dispatch = useAppDispatch()
    const [signedLink, setSignedLink] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const selectedItem: IListItem | Record<string, never> = selected

    /**
     * TODO: create new slice for 'content' and implement getURL as asyncThunk
     */
    useEffect(() => {
        setIsLoading(true)
        if (selectedItem !== undefined || selectedItem !== {}) {
            dispatch(UserService.getUrl(selectedItem.link)).then(
                (res: string) => {
                    setSignedLink(res)
                    setIsLoading(false)
                    return Promise.resolve('done')
                }
            )
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
