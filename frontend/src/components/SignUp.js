/*
  Name: Daniel Urbina
  Date: 4/12/2024
  Course name and section: IT302-002
  Assignment Name: Phase 4
  Email: du35@njit.edu
*/

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import storiesDataService from "../services/storiesDataService";

const SignUp = ({ login }) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onChangeUsername = (e) => {
        setUsername(e.target.value)
    }

    const onChangePassword = (e) => {
        setPassword(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
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
                if(response.data.userResponse.error){
                    console.log(`Error creating user: ${response.data.userResponse.error}`)
                    return
                } else {
                    console.log('User created: ', response.data.userResponse)
                    login({
                        id: response.data.userResponse.insertedId,
                        username: newUser.username,
                        role: newUser.role,
                    })
                    if(isLoading) {
                        setLoading(false)
                    }
                    navigate('/du35_stories')
                }
            })
            .catch(error => {
                console.log('error: ', error)
            })
        
        setUsername("")
        setPassword("")
    }

    return (
        <div>
            <Container>
                <Row className="justify-content-center">
                    <Col md={6}>
                        <Form>
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