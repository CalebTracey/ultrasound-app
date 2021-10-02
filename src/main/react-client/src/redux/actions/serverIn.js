import { SET_CLASSIFICATIONS, SET_MESSAGE } from './types'
import UserService from '../../service/user-service'

const { getClassifications } = UserService

const classifications = () => (dispatch) =>
    getClassifications().then(
        (data) => {
            dispatch({
                type: SET_CLASSIFICATIONS,
                payload: data,
            })
            return Promise.resolve()
        },
        (error) => {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString()

            // dispatch({
            //   type: LOGIN_FAIL,
            // });

            dispatch({
                type: SET_MESSAGE,
                payload: message,
            })

            return Promise.reject(error)
        }
    )

const serverIn = { classifications }

export default serverIn
