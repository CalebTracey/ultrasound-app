import React from 'react'
import { useDispatch } from 'react-redux'
import allActions from '../../redux/actions'

const Logout = () => {
    const dispatch = useDispatch()
    return (
        <div className="form-group" style={{ marginLeft: '1rem' }}>
            <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => dispatch(allActions.auth.logout())}
            >
                Logout
            </button>
        </div>
    )
}

export default Logout
