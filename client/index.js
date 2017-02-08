//import 'bootstrap/dist/css/bootstrap.css';
//import 'bootstrap/dist/css/bootstrap-theme.css';
import React from 'react';
import { render } from 'react-dom';
import App, {requests} from './render_config';

Promise.all(requests).then(() => {
    console.log('All waits should be done by now...');
    console.log('Done waiting for components, now rendering app');
    render(
        <App />,
        document.getElementById('react-view')
    );
});