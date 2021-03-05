import React, { Suspense } from "react";
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
// TODO work out what the hell's going on with this
import 'mobx-react-lite/batchingForReactDom'
import { BrowserRouter as Router } from 'react-router-dom'
import RootStore from './store/rootStore'
import App from './App'
import './index.css'
import "./i18next";

import * as serviceWorker from './serviceWorker'

/* FOR DEVELOPMENT */
import iuGroupMapping from 'pages/components/simulator/helpers/iuGroupMapping';
import SessionStorage from 'pages/components/simulator/helpers/sessionStorage';

window.ntd = {
  iuGroupMapping,
  SessionStorage
};
/* END FOR DEVELOPMENT */

const { dataAPI, uiState } = new RootStore()

ReactDOM.render(
    <React.StrictMode>
        <Suspense fallback={<div>Loading ……</div>}>
            <Provider dataAPI={dataAPI} uiState={uiState}>
                <Router>
                    <App />
                </Router>
            </Provider>
        </Suspense>
    </React.StrictMode>,
    document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
