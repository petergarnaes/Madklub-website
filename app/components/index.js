import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import React from 'react';
import NavBar from './nav_bar';
import { Grid, Jumbotron, Button } from 'react-bootstrap';

export default class AppView extends React.Component {
    render() {
        return (
            <div id="app-view">
                <NavBar />
                {this.props.children}
            </div>
        );
    }
}
