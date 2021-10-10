import './style-fonts/Open_Sans/static/OpenSans/OpenSans-Regular.ttf'
import './style-fonts/Open_Sans/static/OpenSans/OpenSans-Bold.ttf'
import './style-fonts/Open_Sans/static/OpenSans/OpenSans-SemiBold.ttf'
import './style-fonts/Roboto_Condensed/RobotoCondensed-Regular.ttf'
import './style-fonts/Roboto_Slab/static/RobotoSlab-Regular.ttf'
import './style-fonts/Roboto_Slab/static/RobotoSlab-Bold.ttf'
import './style-fonts/Open_Sans/static/OpenSans/OpenSans-Italic.ttf'
import './style-fonts/Roboto_Slab/static/RobotoSlab-SemiBold.ttf'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
// import history from './helpers/history'
// import setupInterceptors from './service/setupInterceptors'
import { BrowserRouter } from 'react-router-dom'

import store, { RootState } from './redux/store'
import './index.css'
import App from './App'

// setupInterceptors(store)

// const { location } = history
ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>,
    document.querySelector('#root')
)
