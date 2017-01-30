import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar,Nav,NavItem,NavDropdown,MenuItem } from 'react-bootstrap';

/*<LinkContainer to="/logout">
 <NavItem eventKey={3.2}>logout</NavItem>
 </LinkContainer>*/

// NavItem can have an eventKey prop, which is sent to onSelect on Nav.
// The /logout NavItem must be a regular link, since we MUST hit the server to reset the login token,
// this throws a warning but we must live with that
const NavBar = ({loggedIn}) => {
    let SessionComponent = (!loggedIn) ? (
        <LinkContainer to="/login">
            <NavItem>Login</NavItem>
        </LinkContainer>
    ) : (
        <NavDropdown eventKey={3} title="Account" id="basic-nav-dropdown">
            <LinkContainer to="/account-settings">
                <NavItem eventKey={3.1}>Settings</NavItem>
            </LinkContainer>
            <MenuItem divider />
            <LinkContainer to="/logout">
                <NavItem eventKey={3.2}><a href="/logout">logout</a></NavItem>
            </LinkContainer>
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

export default connect(mapStateToProps)(NavBar);
