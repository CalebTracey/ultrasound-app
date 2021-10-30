/* eslint-disable no-underscore-dangle */
import React, { useState, FC, useCallback } from 'react'
import { FiPlusSquare } from 'react-icons/fi'
import { useForm, Resolver } from 'react-hook-form'
import CreateModal from '../CreateModal'
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { createSubMenu } from '../../redux/slices/subMenu'

type TFormValues = { name: string }

const ConfirmModal: FC = () => {
    const [modal, setModal] = useState(false)
    const dispatch = useAppDispatch()
    const { classification } = useAppSelector((state) => state)

    const resolver: Resolver<TFormValues> = async (values) => {
        return {
            values: values.name ? values : {},
            errors: !values.name
                ? {
                      name: {
                          type: 'required',
                          message: 'New sub menu name is required.',
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
                createSubMenu({
                    classification: classification.selected._id,
                    name,
                })
            )
        }
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
                actionText="Add Submenu"
                register={register}
                onSubmit={onSubmit}
                handleSubmit={handleSubmit}
                setModal={modal}
                toggleCallback={toggle}
            />
        </>
    )
}

export default ConfirmModal
