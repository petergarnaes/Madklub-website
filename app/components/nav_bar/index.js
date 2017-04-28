import React from 'react';
import Link from 'react-router-dom/Link';
import { connect } from 'react-redux';
import withRouter from 'react-router-dom/withRouter';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import NavItem from 'react-bootstrap/lib/NavItem';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
//import { Navbar,Nav,NavItem,NavDropdown,MenuItem } from 'react-bootstrap';

const goTo = (history) => (key) => {
    var url = "/"+key;
    if(key) history.push(url);
};

// NavItem can have an eventKey prop, which is sent to onSelect on Nav.
const NavBar = ({loggedIn,username,history}) => {
    console.log(history);
    let SessionComponent = (!loggedIn) ? (
        <NavItem eventKey="login" onSelect={goTo(history)}>Login</NavItem>
    ) : (
        <NavDropdown title={username} id="basic-nav-dropdown">
            <MenuItem eventKey="settings" onSelect={goTo(history)}>Indstillinger</MenuItem>
            <MenuItem divider />
            <MenuItem href="/logout">Logout</MenuItem>
        </NavDropdown>
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
                    {SessionComponent}
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

export default connect(mapStateToProps)(withRouter(NavBar));
