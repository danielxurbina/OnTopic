/*
  Name: Daniel Urbina
  Date: 4/25/2024
  Course name and section: IT302-002
  Assignment Name: Phase 5
  Email: du35@njit.edu
*/

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Col, Row, Button, Container, Alert } from "react-bootstrap";
import storiesDataService from "../services/storiesDataService";

const Login = ({ login }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    let responseError = false
    let location = useLocation()
    if(location.state && location.state.error === true){
        responseError = true // will only be set to true if the user was redirected here from a protected route
    }

    const onChangeUsername = (e) => setUsername(e.target.value)
    const onChangePassword = (e) => setPassword(e.target.value)

    const handleSubmit = (e) => {
        e.preventDefault()
        const user = { username: username, password: password }
        setLoading(true)
        window.localStorage.removeItem('currentUserID');
        window.localStorage.removeItem('isLoggedIn');
        window.localStorage.removeItem('token');

        storiesDataService.login(user)
            .then(response => {
                if (response.data.success == true) {
                    const token = response.data.token
                    localStorage.setItem('token', token)
                    // put the token in local storage
                    login({
                        id: response.data.user._id,
                        username: response.data.user.username,
                        role: response.data.user.role,
                    })
                    if (isLoading) {
                        setLoading(false)
                    }
                    navigate('/du35_stories')
                    window.location.reload()
                } else {
                    console.log(`Error logging in: ${response.data.error}`)
                    setError(true)
                }
            })
            .catch(error => {
                console.log(`error: ${error}`)
            })

        setUsername(""); setPassword(""); setLoading(false)
    }

    const formStyle = {
        maxWidth: "400px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        backgroundColor: "#f5f5f5",
    }

    return (
        <div>
            {responseError ? (
                <Alert variant="danger">
                    Must be logged in to perform that action
                </Alert>
            ) : null}
            {error ? (
                <Alert variant="danger" onClose={() => setError(false)} dismissible>
                    Invalid username or password
                </Alert>
            ) : null}
            <Container>
                <Row className="justify-content-center">
                    <Col md={6}>
                        <Form style={formStyle}>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="fromGroupUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter username"
                                        value={username}
                                        onChange={onChangeUsername}
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGroupPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={onChangePassword}
                                    />
                                </Form.Group>
                            </Row>

                            <Button
                                variant="primary"
                                disabled={isLoading}
                                onClick={!isLoading ? handleSubmit : null}
                            >
                                {isLoading ? 'Loading...' : 'Login'}
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Login;