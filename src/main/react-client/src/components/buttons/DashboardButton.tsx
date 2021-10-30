import React, { FC } from 'react'
import { Link } from 'react-router-dom'

const DashboardButton: FC = () => (
    <Link to="/dashboard">
        <div className="form-group" style={{ marginLeft: '1rem' }}>
            <button type="button" className="btn btn-primary">
                Dashboard
            </button>
        </div>
    </Link>
)

export default DashboardButton
