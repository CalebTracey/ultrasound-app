import React, { FC } from 'react'
import { Button } from 'reactstrap'

interface Props {
    reset: () => void
}

const ResetButton: FC<Props> = ({ reset }) => (
        <Button
            className="reset-btn-edit"
            type="button"
            color="warning"
            onClick={() => reset()}
        >
            <span>Reset</span>
        </Button>
    )

export default ResetButton
