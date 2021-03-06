//import 'bootstrap/dist/css/bootstrap.css';
//import 'bootstrap/dist/css/bootstrap-theme.css';
import React from 'react';
import Route from 'react-router-dom/Route';
import Main from './main';
import Login from './login/async_version';
import Calendar from './calendar/calendar_component/async_version';
import UserSettings from './user_settings/async_version';
import AdminSettings from './admin_settings/async_version';
import Accounting from './accounting/async_version';
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
                <Route exact path="/user_settings" component={UserSettings}/>
                <Route exact path="/admin_settings" component={AdminSettings}/>
                <Route exact path="/accounting" component={Accounting}/>
            </div>
        );
    }
}

export default App;