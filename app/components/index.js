//import 'bootstrap/dist/css/bootstrap.css';
//import 'bootstrap/dist/css/bootstrap-theme.css';
import React from 'react';
import Route from 'react-router-dom/Route';
import Main from './main';
import Login from './login';
import NavBar from './nav_bar';
import '../themes/css/theme.min.css';

class App extends React.Component {
    render() {
        return (
            <div id="app-view">
                <NavBar />
                <Route exact path="/" component={Main}/>
                <Route path="/login" component={Login}/>
            </div>
        );
    }
}

export default App;