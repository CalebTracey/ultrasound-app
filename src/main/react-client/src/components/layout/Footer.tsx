import React, { FC } from 'react'
// import { MdCopyright } from 'react-icons/md';

const Footer: FC = () => (
    <footer>
        <div className="footer___text">
            <small>
                &copy; Copyright {new Date().getFullYear()}, MMC Division of
                Emergency Ultrasound
            </small>
        </div>
    </footer>
)

export default Footer
