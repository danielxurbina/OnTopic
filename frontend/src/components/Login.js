/*
  Name: Daniel Urbina
  Date: 4/12/2024
  Course name and section: IT302-002
  Assignment Name: Phase 4
  Email: du35@njit.edu
*/

import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import storiesDataService from "../services/storiesDataService";
import Form from "react-bootstrap/Form";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

const Login = ({ login }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setLoading] = useState(false);

    const onChangeUsername = (e) => {
        const username = e.target.value
        setUsername(username)
    }

    const onChangePassword = (e) => {
        const password = e.target.value
        setPassword(password)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const user = { username: username, password: password }
        setLoading(true)

        storiesDataService.login(user)
            .then(response => {
                console.log(`response data: ${JSON.stringify(response.data)}`)
                if(response.data.success == true){
                    const token = response.data.token
                    localStorage.setItem('token', token)
                    // put the token in local storage
                    console.log('User Object: ', response.data.user)
                    login({
                        id: response.data.user._id,
                        username: response.data.user.username,
                        role: response.data.user.role,
                    })
                    if(isLoading){
                        setLoading(false)
                    }
                    navigate('/du35_stories')
                } else {
                    console.log(`Error logging in: ${response.data.error}`)
                }
            })
            .catch(error => {
                console.log(`error: ${error}`)
            })
        
        setUsername(""); setPassword("")
    }
    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <Form>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="fromGroupUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control type="text" placeholder="Enter username" value={username} onChange={onChangeUsername} />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGroupPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Enter password" value={password} onChange={onChangePassword} />
                                </Form.Group>
                            </Row>
                            
                            <Button variant="primary" disabled={isLoading} onClick={!isLoading ? handleSubmit : null}>
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