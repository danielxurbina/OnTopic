import "bootstrap/dist/css/bootstrap.min.css"
import { NavLink } from "react-router-dom"
import { Container, Navbar, Nav } from "react-bootstrap"

const NavigationBar = ({ currentUser, logout }) => {
    const isLoggedIn = window.localStorage.getItem("isLoggedIn")

    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand as={NavLink} to="/" style={{ cursor: 'pointer'}}>OnTopic</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={NavLink} to={"/du35_stories"}>Home</Nav.Link>
                            { isLoggedIn && <Nav.Link as={NavLink} to="/du35_submit">Create Story</Nav.Link> }
                            { isLoggedIn && <Nav.Link as={NavLink} to={`/du35_profile/${currentUser?.id}`}>Profile</Nav.Link> }
                            { isLoggedIn ? (
                                <Nav.Link onClick={logout}>Logout</Nav.Link>
                            ) : (
                                <Nav.Link as={NavLink} to="/du35_login">Login</Nav.Link>
                            )}
                            { !isLoggedIn && <Nav.Link as={NavLink} to="/du35_signup">Sign Up</Nav.Link> }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default NavigationBar;