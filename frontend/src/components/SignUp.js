/*
  Name: Daniel Urbina
  Date: 4/25/2024
  Course name and section: IT302-002
  Assignment Name: Phase 5
  Email: du35@njit.edu
*/

import React, { useState } from "react";
import { Form, Col, Row, Button, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import storiesDataService from "../services/storiesDataService";

const SignUp = ({ login }) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const onChangeUsername = (e) => setUsername(e.target.value)
    const onChangePassword = (e) => setPassword(e.target.value)

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        window.localStorage.removeItem('currentUserID');
        window.localStorage.removeItem('isLoggedIn');
        window.localStorage.removeItem('token');

        const newUser = {
            username: username,
            password: password,
            role: "user",
            stories: [],
            comments: [],
            createdAt: new Date(),
            lastModified: new Date()
        }

        storiesDataService.createUser(newUser)
            .then(response => {
                console.log('response: ', response.data)
                if(response.data.success === true){
                    const token = response.data.token
                    localStorage.setItem('token', token)
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
                    console.log(`Error creating user: ${response.data.error}`)
                    setError(true)
                }
            })
            .catch(error => {
                console.log('error: ', error)
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
            {error ? (
                <Alert variant="danger" onClose={() => setError(false)} dismissible>
                    Something went wrong while creating your account. Please try again.
                </Alert>
            ) : (
                <></>
            )}
            <Container>
                <Row className="justify-content-center">
                    <Col md={6}>
                        <Form style={formStyle}>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="fromGroupUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        required type="text"
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
                                        required
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
                                {isLoading ? 'Loading...' : 'Sign Up'}
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default SignUp;