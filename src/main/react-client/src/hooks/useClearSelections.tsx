import { useState, useCallback } from 'react'
import { useAppDispatch } from '../redux/hooks'
import { resetItemSelection } from '../redux/slices/item'
import { resetSubMenuSelection } from '../redux/slices/subMenu'
import { resetClassificationSelection } from '../redux/slices/classification'
import { clearAll } from '../redux/slices/message'

const useClearSelections = (): [boolean, () => void] => {
    const [cleared, setResponse] = useState(false)
    const dispatch = useAppDispatch()
    const clearSelections = useCallback(() => {
        dispatch(clearAll())
        dispatch(resetItemSelection())
        dispatch(resetSubMenuSelection())

        setResponse(true)
    }, [dispatch])
    return [cleared, clearSelections]
}
export default useClearSelections
