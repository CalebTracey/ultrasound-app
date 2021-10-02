/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import AddForm from './AddForm'
import allActions from '../../redux/actions'
import Upload from '../content/Upload'

const AddFormContainer = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [successful, setSuccessful] = useState(false)
    const { message } = useSelector((state) => state.message)
    const [details, setDetails] = useState(null)
    const [files, setFiles] = useState([])
    const [category, setCategory] = useState('')
    const [classification, setClassification] = useState('')
    const [payload, setPayload] = useState(null)
    const dispatch = useDispatch()

    const validationSchema = Yup.object().shape({
        classification: Yup.string().required('Classification is required'),
        category: Yup.string().required('Category is required'),
        superCategory: Yup.string().optional(),
        subCategory: Yup.string().optional(),
    })

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    })

    const handleUpload = () => {
        if (successful && !isLoading) {
            if (details && files) {
                setPayload({ details, files })
            } else {
                setPayload(details)
            }
            console.log(`FORM DATA: ${payload}`)
        }
    }

    const onSubmit = (data) => {
        if (Array.from(errors).length === 0) {
            // const { category, classification } = data;
            console.log(data)
            const file = data.files
            setCategory(data.category)
            setClassification(data.classification)
            if (file) {
                setFiles(file)
            }
            setDetails(data)
            console.log(data)
            setIsLoading(false)
            setSuccessful(true)
        }
    }

    useEffect(() => {
        if (payload) {
            dispatch(allActions.serverOut.upload(payload))
                .then(() => {
                    setSuccessful(true)
                })
                .catch(() => {
                    setSuccessful(false)
                })
        }
    }, [payload, dispatch])
    return (
        <div className="form-wrapper">
            <div>{`Classification: ${classification}\n`}</div>
            <div>{`Category: ${category}\n`}</div>
            <div>{`Files: ${files.length}\n`}</div>
            <AddForm
                successful={successful}
                message={message}
                onSubmit={onSubmit}
                errors={errors}
                register={register}
                handleSubmit={handleSubmit}
                reset={reset}
            />
            <div>
                <button
                    type="button"
                    className="btn btn-primary btn-block"
                    disabled={!successful}
                    onClick={() => handleUpload()}
                >
                    <span>Upload</span>
                </button>
            </div>
            <Upload setIsLoading={setIsLoading} setFiles={setFiles} />
        </div>
    )
}

export default AddFormContainer
