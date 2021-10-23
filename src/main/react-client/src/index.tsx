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
import { BrowserRouter } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker'
import store from './redux/store'
import './index.css'
import App from './App'

ReactDOM.render(
    <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>,
    document.querySelector('#root')
)
registerServiceWorker()
