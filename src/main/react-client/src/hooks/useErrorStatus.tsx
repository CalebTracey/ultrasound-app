import { AxiosError } from 'axios'
import { useState, useCallback } from 'react'

interface ResponseError extends Error {
    status?: number
}
interface Props {
    error: ResponseError | AxiosError | undefined
}

const useErrorStatus = (props: Props): [number | undefined, () => void] => {
    const { error } = props
    const [response, setResponse] = useState<number | undefined>(undefined)

    const isAxiosError = (value: unknown): value is AxiosError => {
        return !!value && !!(value as AxiosError)
    }
    const isError = (value: unknown): value is ResponseError => {
        return !!value && !!(value as ResponseError)
    }

    const getErrorResponse = useCallback(() => {
        if (isAxiosError(error) && error.isAxiosError) {
            setResponse(error.response?.status)
        } else if (isError(error)) {
            setResponse(error.status)
        }
    }, [error])

    return [response, getErrorResponse]
}

export default useErrorStatus
