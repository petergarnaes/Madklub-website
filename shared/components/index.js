import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import React from 'react';
import { Grid, Navbar, Jumbotron, Button } from 'react-bootstrap';

export default class AppView extends React.Component {
    render() {
        return (
            <div id="app-view">
                <Navbar inverse fixedTop>
                    <Grid>
                        <Navbar.Header>
                            <Navbar.Brand>
                                <a href="/">React App</a>
                            </Navbar.Brand>
                            <Navbar.Toggle />
                        </Navbar.Header>
                    </Grid>
                </Navbar>
                <Jumbotron>
                    <Grid>
                        <h1>Todos and stuff</h1>
                        <p>
                        <Button
                            bsStyle="success"
                            bsSize="large"
                            href="http://react-bootstrap.github.io/components.html"
                            target="_blank">
                            View React Boostrap Docs
                        </Button>
                        </p>
                    </Grid>
                </Jumbotron>
                {this.props.children}
            </div>
        );
    }
}
