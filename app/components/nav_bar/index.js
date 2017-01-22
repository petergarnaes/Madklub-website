import React from 'react';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar,Nav,NavItem } from 'react-bootstrap';

// NavItem can have an eventKey prop, which is sent to onSelect on Nav
const NavBar = () => {
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
                    <LinkContainer to="/login">
                        <NavItem>Login</NavItem>
                    </LinkContainer>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default NavBar;
