/* eslint-disable no-underscore-dangle */
import React, { useState, FC, useCallback } from 'react'
import { FiPlusSquare } from 'react-icons/fi'
import { useForm, Resolver } from 'react-hook-form'
import CreateModal from '../CreateModal'
import { useAppDispatch } from '../../redux/hooks'
import { createClassification } from '../../redux/slices/classification'

type TFormValues = { name: string }

const CreateClassificationButton: FC = () => {
    const [modal, setModal] = useState(false)
    const dispatch = useAppDispatch()

    const resolver: Resolver<TFormValues> = async (values) => {
        return {
            values: values.name ? values : {},
            errors: !values.name
                ? {
                      name: {
                          type: 'required',
                          message: 'New classification name is required.',
                      },
                  }
                : {},
        }
    }
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TFormValues>({ resolver, mode: 'onChange' })

    const toggle = useCallback(() => {
        setModal(!modal)
    }, [modal])

    const onSubmit = (formValues: TFormValues) => {
        const { name } = formValues
        if (!errors.name) {
            dispatch(
                createClassification({
                    name,
                })
            )
        }
        toggle()
    }

    return (
        <>
            <button
                style={{
                    padding: '0',
                    // marginLeft: '.5rem',
                    // display: 'flex',
                    position: 'relative',
                    height: '2rem',
                    width: '2rem',
                    minHeight: 0,
                }}
                id="create-submenu-button"
                type="button"
                className="btn btn-outline-primary menu-button"
                onClick={toggle}
            >
                <big>
                    <FiPlusSquare />
                </big>
            </button>
            <CreateModal
                actionText="Create new Classification"
                register={register}
                onSubmit={onSubmit}
                handleSubmit={handleSubmit}
                setModal={modal}
                toggleCallback={toggle}
            />
        </>
    )
}

export default CreateClassificationButton
