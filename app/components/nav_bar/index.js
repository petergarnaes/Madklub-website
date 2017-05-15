import React from 'react';
import Link from 'react-router-dom/Link';
import { connect } from 'react-redux';
import withRouter from 'react-router-dom/withRouter';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import NavItem from 'react-bootstrap/lib/NavItem';
import SessionComponent from './session_component';
import pure from 'recompose/pure';

const goTo = (history) => (key) => {
    var url = "/"+key;
    if(key) history.push(url);
};

// NavItem can have an eventKey prop, which is sent to onSelect on Nav.
const NavBar = ({loggedIn,username,history}) => {
    let OptionsComponent = (!loggedIn) ? (
        <NavItem eventKey="login" onSelect={goTo(history)}>Login</NavItem>
    ) : (
        <SessionComponent display_name={username}/>
    );
    let CalendarComponent = (loggedIn) ?
        <NavItem eventKey="calendar" onSelect={goTo(history)}>
            Uge Oversigt
            <Glyphicon
                style={{paddingLeft:1+'em'}}
                glyph="calendar"/>
        </NavItem> :
        null;
    return (
        <Navbar inverse collapseOnSelect>
            <Navbar.Header>
                <Navbar.Brand>
                    <Link to="/">Madklub</Link>
                </Navbar.Brand>
                <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
                <Nav pullRight>
                    {CalendarComponent}
                    {OptionsComponent}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
};

let mapStateToProps = (state) => {
    return {
        loggedIn: state.isLoggedIn,
        username: (state.isLoggedIn) ? state.currentUser.userDisplayName : ''
    }
};

export default connect(mapStateToProps)(withRouter(pure(NavBar)));
