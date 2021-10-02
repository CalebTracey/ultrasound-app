import React from 'react'
import { Link } from 'react-router-dom'

const RegisterButton = () => (
    <Link to="/register">
        <div className="form-group">
            <button type="button" className="btn btn-primary">
                Register
            </button>
        </div>
    </Link>
)

export default RegisterButton
