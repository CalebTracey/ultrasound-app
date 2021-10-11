import { useState, useCallback } from 'react'
import { useAppDispatch } from '../redux/hooks'
import { resetItemSelection } from '../redux/slices/item'
import { resetSubMenuSelection } from '../redux/slices/subMenu'
import { clearMessage } from '../redux/slices/message'

const useClearSelections = (): [boolean, () => void] => {
    const [cleared, setResponse] = useState(false)
    const dispatch = useAppDispatch()
    const clearSelections = useCallback(() => {
        dispatch(clearMessage())
        dispatch(resetItemSelection())
        dispatch(resetSubMenuSelection())

        setResponse(true)
    }, [dispatch])
    return [cleared, clearSelections]
}
export default useClearSelections
