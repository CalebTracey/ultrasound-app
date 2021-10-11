/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, FC, useCallback, useState } from 'react'
import { useLocation, withRouter } from 'react-router-dom'
import { Media, Jumbotron, Alert, Button } from 'reactstrap'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import EditHeader from '../components/edit/EditHeader'
import useClearSelections from '../hooks/useClearSelections'
import { IClassification } from '../schemas'
import useItems from '../hooks/useItems'
import { resetItemSelection } from '../redux/slices/item'
import { editingSubMenu } from '../redux/slices/subMenu'
import { editingClassification } from '../redux/slices/classification'
import EditContentPane from '../components/edit/EditContentPane'
import { clearMessage } from '../redux/slices/message'

const Edit: FC = (): JSX.Element | null => {
    const loadingState = useAppSelector((state) => state.classification.loading)
    const { message, subMenu, item } = useAppSelector((state) => state)
    const { selected, subMenuCount, editing } = useAppSelector(
        (state) => state.classification
    )
    const location = useLocation()
    const [isDataLoading, setIsDataLoading] = useState(false)
    const [, clearSelections] = useClearSelections()
    const dispatch = useAppDispatch()
    const [response, getItems] = useItems({
        parentId: '',
        list: [],
        isLoading: false,
        error: null,
    })

    const handleCancel = useCallback(() => {
        setIsDataLoading(true)
        clearSelections()
        dispatch(editingClassification(true))
        dispatch(editingSubMenu(false))
        getItems()
        setIsDataLoading(false)
    }, [clearSelections, getItems, dispatch])

    const isClassification = (value: unknown): value is IClassification => {
        return !!value && !!(value as IClassification)
    }

    useEffect(() => {
        const controller = new AbortController()
        if (
            !response.isLoading &&
            item.loading !== 'successful' &&
            !subMenu.editing
        ) {
            setIsDataLoading(true)
            if (item.size !== 0) {
                resetItemSelection()
            }
            console.log('CLASS ITEMS')
            getItems()
        }
        setIsDataLoading(false)
        return () => controller?.abort()
    }, [getItems, item, loadingState, subMenu, response])

    useEffect(() => {
        clearMessage()
    }, [location.pathname])

    return isClassification(selected) && !isDataLoading ? (
        <Jumbotron>
            {message.text && <Alert color="info">{message.text}</Alert>}
            <EditHeader
                classification={selected}
                subMenuCount={subMenuCount}
                hasSubMenu={selected.hasSubMenu}
            />
            <div className="edit">
                <hr className="my-2" />
                <Media body>
                    <Button
                        style={{ position: 'relative' }}
                        outline
                        color="danger"
                        onClick={handleCancel}
                    >
                        <span className="edit___drop-down-item">Cancel</span>
                    </Button>
                    <EditContentPane
                        hasSubMenu={selected.hasSubMenu}
                        editing={editing}
                    />
                </Media>
            </div>
        </Jumbotron>
    ) : null
}

export default withRouter(Edit)
