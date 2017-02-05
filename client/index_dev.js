/**
 * Created by peter on 2/4/17.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './render_config';
import { AppContainer } from 'react-hot-loader';

const renderApp = (Component) => ReactDOM.render(<AppContainer><Component/></AppContainer>,
    document.getElementById('react-view'));

renderApp(App);

// Hot Module Replacement API
if (module.hot) {
    console.log("Hi mom!");
    module.hot.accept('./render_config', () => {
        renderApp(App)
    });
}