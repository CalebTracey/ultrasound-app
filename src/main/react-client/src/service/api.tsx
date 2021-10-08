/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import React from 'react'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import history from '../helpers/history'
import EventBus from '../common/EventBus'
import TokenService from './token-service'
import { newError } from '../redux/slices/message'

enum StatusCode {
    Unauthorized = 401,
    Forbidden = 403,
    TooManyRequests = 429,
    InternalServerError = 500,
}

const headers: Readonly<Record<string, string | boolean>> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    // 'Access-Control-Allow-Credentials': true,
    // 'X-Requested-With': 'XMLHttpRequest',
}
const { getLocalAccessToken } = TokenService
const injectToken = (config: AxiosRequestConfig): AxiosRequestConfig => {
    try {
        const token = getLocalAccessToken()
        console.log(token)
        if (token != null) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    } catch (error) {
        throw new Error('Error!')
        // console.error(error)
    }
}

class Http {
    private instance: AxiosInstance | null = null

    private get http(): AxiosInstance {
        return this.instance != null ? this.instance : this.initHttp()
    }

    initHttp() {
        const http = axios.create({
            baseURL: 'http://localhost:8080/api/',
            headers,
            withCredentials: true,
        })

        http.interceptors.request.use(injectToken, (error) =>
            Promise.reject(error)
        )

        http.interceptors.response.use(
            (response) => response,
            (error) => {
                const { response, message } = error
                console.log(`ERROR ${response}`)
                return this.handleError(response)
            }
        )

        this.instance = http
        return http
    }

    request<T = any, R = AxiosResponse<T>>(
        config: AxiosRequestConfig
    ): Promise<R> {
        return this.http.request(config)
    }

    get<T = any, R = AxiosResponse<T>>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<R> {
        return this.http.get<T, R>(url, config)
    }

    post<T = any, R = AxiosResponse<T>>(
        url: string,
        data?: T,
        config?: AxiosRequestConfig
    ): Promise<R> {
        return this.http.post<T, R>(url, data, config)
    }

    put<T = any, R = AxiosResponse<T>>(
        url: string,
        data?: T,
        config?: AxiosRequestConfig
    ): Promise<R> {
        return this.http.put<T, R>(url, data, config)
    }

    delete<T = any, R = AxiosResponse<T>>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<R> {
        return this.http.delete<T, R>(url, config)
    }

    // Handle global app errors
    // We can handle generic app errors depending on the status code
    private handleError(error: { status: any; message: string }) {
        const { status, message } = error
        switch (status) {
            case StatusCode.InternalServerError:
                // Handle InternalServerError
                break
            // no default

            case StatusCode.Forbidden:
                // Handle Forbidden
                break
            // no default

            case StatusCode.Unauthorized:
                newError(message)
                history.push('/home')
                EventBus.dispatch('logout')
                break
            // no default

            case StatusCode.TooManyRequests:
                // Handle TooManyRequests
                break
            // no default
        }

        return Promise.reject(error)
    }
}

export const api = new Http()
// // const { REACT_APP_API_URL } = process.env;

// const instance = axios.create({
//     // baseURL: REACT_APP_API_URL,
//     baseURL: 'http://localhost:8080/api/',
//     headers: {
//         'Content-Type': 'application/json',
//     },
// })

// export default instance
