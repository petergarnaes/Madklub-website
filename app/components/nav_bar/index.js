import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Navbar,Nav,NavItem,NavDropdown,MenuItem } from 'react-bootstrap';

const goTo = (push) => (key) => {
    var url = "/"+key;
    if(key) push(url);
};

// NavItem can have an eventKey prop, which is sent to onSelect on Nav.
const NavBar = ({loggedIn,push}) => {
    let SessionComponent = (!loggedIn) ? (
        <NavItem eventKey="login" onSelect={goTo(push)}>Login</NavItem>
    ) : (
        <NavDropdown title="Account" id="basic-nav-dropdown">
            <MenuItem eventKey="settings" onSelect={goTo(push)}>Settings</MenuItem>
            <MenuItem divider />
            <MenuItem href="/logout">Logout</MenuItem>
        </NavDropdown>
    );
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
                    {SessionComponent}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
};

let mapStateToProps = (state) => {
    return {
        loggedIn: state.isLoggedIn
    }
};

export default connect(mapStateToProps)(withRouter(NavBar));
