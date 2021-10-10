import { useState, useCallback } from 'react'
import { unwrapResult } from '@reduxjs/toolkit'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { IClassification } from '../schemas'
import { getAllClassifications } from '../redux/slices/classification'
import { newError } from '../redux/slices/message'

interface Props {
    classifications: IClassification[] | Record<string, unknown>
    isLoading: boolean
    error: null
}
const useClassifications = (props: Props): [Props, () => void] => {
    const { classifications, isLoading, error } = props
    const subMenuLoading = useAppSelector((state) => state.subMenu.loading)
    const { entities } = useAppSelector((state) => state.classification)
    const dispatch = useAppDispatch()
    const [response, setResponse] = useState({
        classifications,
        isLoading,
        error,
    })

    const isClassificationList = (
        value: unknown
    ): value is IClassification[] => {
        return !!value && !!(value as IClassification[])
    }
    const getClassifications = useCallback(() => {
        setResponse((prevState) => ({ ...prevState, isLoading: true }))
        const classificationsCurrent: IClassification[] = entities
        if (
            classificationsCurrent !== undefined &&
            classificationsCurrent.length !== 0
        ) {
            setResponse({
                classifications: classificationsCurrent,
                isLoading: false,
                error: null,
            })
        } else if (
            subMenuLoading !== 'pending' &&
            entities !== undefined &&
            entities.length === 0
        ) {
            dispatch(getAllClassifications())
                .then(unwrapResult)
                .then((res: IClassification[]) => {
                    if (isClassificationList(res)) {
                        const classificationsFetched: IClassification[] = res
                        if (classificationsFetched !== undefined) {
                            setResponse({
                                classifications: classificationsFetched,
                                isLoading: false,
                                error: null,
                            })
                        }
                    }
                })
            // .catch((err: Error) => {
            //     console.error(err)
            //     dispatch(newError(err.message))
            //     // return Promise.reject(err)
            // })
        }
    }, [dispatch, entities, subMenuLoading])
    return [response, getClassifications]
}

export default useClassifications
