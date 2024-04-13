/*
  Name: Daniel Urbina
  Date: 4/12/2024
  Course name and section: IT302-002
  Assignment Name: Phase 4
  Email: du35@njit.edu
*/

import "bootstrap/dist/css/bootstrap.min.css"
import { NavLink } from "react-router-dom"
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"

const NavigationBar = ({ logout }) => {
    const isLoggedIn = window.localStorage.getItem("isLoggedIn")

    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="/"/>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={NavLink} to={"/"}>Home</Nav.Link>
                            {isLoggedIn && (
                                <Nav.Link as={NavLink} to="/du35_submit">Create Story</Nav.Link>
                            )}
                            {isLoggedIn ? (
                                <Nav.Link onClick={logout}>Logout</Nav.Link>
                            ) : (
                                <Nav.Link as={NavLink} to="/du35_login">Login</Nav.Link>
                            )}
                            {!isLoggedIn && (
                                <Nav.Link as={NavLink} to="/du35_signup">Sign Up</Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default NavigationBar;