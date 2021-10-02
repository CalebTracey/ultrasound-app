import React from 'react'
import { Link } from 'react-router-dom'

const HomeButton = () => (
    <Link to="/home">
        <div className="form-group" style={{ marginLeft: '1rem' }}>
            <button type="button" className="btn btn-outline-primary">
                Home
            </button>
        </div>
    </Link>
)

export default HomeButton
