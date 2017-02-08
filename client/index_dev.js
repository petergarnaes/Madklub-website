/**
 * Created by peter on 2/4/17.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import async_map from '../app/async/components';
import {set_resolved_component} from '../app/async/resolved_components';
import App, {state} from './render_config';
import { AppContainer } from 'react-hot-loader';

// for each registered route
console.log(state);
console.log(state.registeredRoutes);
/*if(state.registeredRoutes){
    Object.keys(state.registeredRoutes).forEach(async function(route) {
        console.log('We have to wait for '+route);
        //console.log('What is this? '+async_map[route]());
        //import_components.push( async_map[route]() )
        let c = await async_map[route]();
        console.log('Wait is over');
        set_resolved_component(route,c);
    });
}*/

function asyncFunction (route, cb) {
    async_map[route]().then((c)=>{
        console.log('We now have loaded '+route);
        console.log(c);
        set_resolved_component(route,c.default);
        cb();
    });
}

/*let requests = Object.keys(state.registeredRoutes).reduce((promiseChain, item) => {
    return promiseChain.then(() => new Promise((resolve) => {
        asyncFunction(item, resolve);
    }));
}, Promise.resolve());*/
let requests = Object.keys(state.registeredRoutes).map((item) => {
    return new Promise((resolve) => {
        asyncFunction(item, resolve);
    });
})

//let components = await Promise.all(import_components);
//console.log(components);
//set_resolved_components(components);

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
    module.hot.accept('./render_config', () => {
        renderApp(App)
    });
}