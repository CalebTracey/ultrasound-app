/* eslint-disable react/prop-types */
import React, { FC } from 'react'

interface Props {
    email: string
}
const UserInfoHeader: FC<Props> = ({ email }) => (
    <div
        style={{ fontSize: '1.35ch', color: '#6C757D' }}
        className="form-group"
    >
        {email}
    </div>
)
export default UserInfoHeader
