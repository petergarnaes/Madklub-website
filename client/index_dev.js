/**
 * Created by peter on 2/4/17.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import App, {requests} from './render_config';
import { AppContainer } from 'react-hot-loader';

// for each registered route
//console.log(state);

const renderApp = (Component) => ReactDOM.render(<AppContainer><Component/></AppContainer>,
    document.getElementById('react-view'));

Promise.all(requests).then(() => {
    console.log('All waits should be done by now...');
    console.log('Done waiting for components, now rendering app');
    renderApp(App);
});

// Hot Module Replacement API
if (module.hot) {
    console.log("Hi mom!");
    module.hot.accept('./index_dev.js');
    module.hot.accept('../app/components/index', () => {
        renderApp(App)
    });
}