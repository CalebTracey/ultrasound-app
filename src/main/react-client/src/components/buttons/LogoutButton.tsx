import React, { FC } from 'react'
import eventBus from '../../common/EventBus'

const LogoutButton: FC = () => {
    return (
        <div className="form-group" style={{ marginLeft: '1rem' }}>
            <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => eventBus.dispatch('logout')}
            >
                Logout
            </button>
        </div>
    )
}

export default LogoutButton
