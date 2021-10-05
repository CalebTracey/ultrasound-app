import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import history from './helpers/history'
// import setupInterceptors from './service/setupInterceptors'
import store, { RootState } from './redux/store'
import './index.css'
import App from './App'

// setupInterceptors(store)

// const { location } = history
ReactDOM.render(
    <Provider store={store}>
        <App history={history} />
    </Provider>,
    document.querySelector('#root')
)
