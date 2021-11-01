/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import React, { FC, useEffect } from 'react'
import { IClassification } from '../../schemas'
import ClassificationItem from './ClassificationItem'
import useClassifications from '../../hooks/useClassifications'
import { useAppSelector } from '../../redux/hooks'

const ClassificationList: FC = () => {
    const { user, loading } = useAppSelector((state) => state.auth)
    const [response, getClassifications] = useClassifications({
        classifications: [],
        isLoading: false,
        error: null,
    })
    const { isLoading, classifications } = response

    const isClassifications = (value: unknown): value is IClassification[] => {
        return !!value && !!(value as IClassification[])
    }

    useEffect(() => {
        if (loading === 'successful' && user.accessToken) getClassifications()
    }, [getClassifications, loading, user])

    const classificationListNode =
        !isLoading &&
        classifications !== undefined &&
        isClassifications(classifications) &&
        classifications.map((classification: IClassification) => {
            return (
                // <div id={`cl-wrapper-${classification._id}`}>
                <ClassificationItem
                    key={`cl-item-${classification._id}`}
                    classification={classification}
                />
                // </div>
            )
        })

    return <>{classificationListNode}</>
}

export default ClassificationList
