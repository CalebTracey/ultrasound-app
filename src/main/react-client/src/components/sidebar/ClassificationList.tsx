/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import React, { FC, useEffect } from 'react'
import { IClassification } from '../../schemas'
import ClassificationItem from './ClassificationItem'
import useClassifications from '../../hooks/useClassifications'

const ClassificationList: FC = () => {
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
        getClassifications()
    }, [getClassifications])

    const classificationListNode =
        !isLoading && classifications && isClassifications(classifications) ? (
            classifications.map((classification: IClassification) => {
                return <ClassificationItem classification={classification} />
            })
        ) : (
            <>Loading...</>
        )

    return <>{classificationListNode}</>
}

export default ClassificationList
