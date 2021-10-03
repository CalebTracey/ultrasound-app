import React from 'react'
import { useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'

const Classification = () => {
    const { selectedClassification } = useSelector((state) => state.data)
    const { name } = selectedClassification

    return (
        <div className="content-wrapper">
            <div className="video-title-wrapper">{name}</div>
        </div>
    )
}

export default withRouter(Classification)
