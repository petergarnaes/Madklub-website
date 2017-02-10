//import 'bootstrap/dist/css/bootstrap.css';
//import 'bootstrap/dist/css/bootstrap-theme.css';
import React from 'react';
import Route from 'react-router-dom/Route';
import Main from './main';
import Login from './login/async_version';
import Calendar from './calendar_component/async_version';
import NavBar from './nav_bar';
import '../themes/css/theme.min.css';

class App extends React.Component {
    render() {
        return (
            <div id="app-view">
                <NavBar />
                <Route exact path="/" component={Main}/>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/calendar" component={Calendar}/>
            </div>
        );
    }
}

export default App;