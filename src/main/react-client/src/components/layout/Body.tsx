/* eslint-disable react/prop-types */
import React from 'react'
import Content from '../content/Content'
import Footer from './Footer'
import Header from './Header'
// import { useAppSelector, useAppDispatch } from '../../redux/hooks'

const Body = (): JSX.Element => {
    return (
        <div className="body">
            <Header />
            <Content />
            <Footer />
        </div>
    )
}

export default Body
