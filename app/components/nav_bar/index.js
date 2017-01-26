import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar,Nav,NavItem } from 'react-bootstrap';

// NavItem can have an eventKey prop, which is sent to onSelect on Nav
const NavBar = ({loggedIn}) => {
    let SessionComponent = (!loggedIn) ? (
        <LinkContainer to="/login">
            <NavItem>Login</NavItem>
        </LinkContainer>
    ) : (
        <LinkContainer to="/account">
            <NavItem>Account</NavItem>
        </LinkContainer>
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
