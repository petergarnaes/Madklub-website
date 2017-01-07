//import 'bootstrap/dist/css/bootstrap.css';
//import 'bootstrap/dist/css/bootstrap-theme.css';
import React       from 'react';
import { render }  from 'react-dom';
import { browserHistory, Router }  from 'react-router';
//import createBrowserHistory from 'history/lib/createBrowserHistory';
import routes from './../app/routes';

//const history = createBrowserHistory();

render(
    <Router children={routes} history={browserHistory} />,
    document.getElementById('react-view')
);
