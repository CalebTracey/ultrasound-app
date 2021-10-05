import React from 'react'
import EventBus from '../../common/EventBus'

const LogoutButton = () => {
    return (
        <div className="form-group" style={{ marginLeft: '1rem' }}>
            <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => EventBus.dispatch('logout')}
            >
                Logout
            </button>
        </div>
    )
}

export default LogoutButton
