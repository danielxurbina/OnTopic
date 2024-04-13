/*
  Name: Daniel Urbina
  Date: 4/12/2024
  Course name and section: IT302-002
  Assignment Name: Phase 4
  Email: du35@njit.edu
*/

import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container'
import storiesDataService from "../services/storiesDataService";

const AddStory = (props) => {
    const [title, setTitle] = useState("")
    const [text, setText] = useState("")
    const [url, setUrl] = useState("")
    const [image, setImage] = useState("")
    const navigate = useNavigate();

    const onTitleChange = (e) => {
        const title = e.target.value
        setTitle(title)
    }

    const onTextChange = (e) => {
        const text = e.target.value
        setText(text)
    }

    const onUrlChange = (e) => {
        const url = e.target.value
        setUrl(url)
    }

    const onImageChange = (e) => {
        const image = e.target.value
        setImage(image)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const newStory = {
            by: props.currentUser.username,
            user_id: props.currentUser.id,
            title: title,
            text: text,
            url: url != "" ? url : "",
            image: image != "" ? image : ""
        }

        storiesDataService.createStory(newStory)
            .then(response => {
                console.log('Story created: ', response.data);
                navigate("/du35_stories")
            })
            .catch(error => {
                console.log(error);
            });

        setTitle(""); setText(""); setUrl(""); setImage("")
    }

    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <Form>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridEmail">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control type="text" onChange={onTitleChange} />
                                </Form.Group>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label>Text</Form.Label>
                                <Form.Control as="textarea" rows={3} onChange={onTextChange} />
                            </Form.Group>

                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridCity">
                                    <Form.Label>Story Url</Form.Label>
                                    <Form.Control type="url" placeholder="Url (Optional)" onChange={onUrlChange} />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridZip">
                                    <Form.Label>Image URL</Form.Label>
                                    <Form.Control type="url" placeholder="Url (Optional)" onChange={onImageChange} />
                                </Form.Group>
                            </Row>

                            <Button variant="primary" type="submit" onClick={handleSubmit}>Submit</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default AddStory;