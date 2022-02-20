import React, { FC } from 'react'
// import { MdCopyright } from 'react-icons/md';

const Footer: FC = () => (
    <footer>
        <small>
            &copy; Copyright {new Date().getFullYear()}, Division of Emergency
            Ultrasound
        </small>
    </footer>
)

export default Footer
