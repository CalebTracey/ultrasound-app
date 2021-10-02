/* eslint-disable react/prop-types */
import React from 'react'
import { useSelector } from 'react-redux'
import SyncLoader from 'react-spinners/SyncLoader'
import Content from '../content/Content'
import Footer from './Footer'
import Header from './Header'

const Body = ({ content }) => {
    const { user } = useSelector((state) => state.auth)

    return content ? (
        <div className="body">
            <Header content={content} user={user} />
            <Content user={user} />
            <Footer />
        </div>
    ) : (
        <div className="spinner">
            <SyncLoader />
        </div>
    )
}

export default Body
