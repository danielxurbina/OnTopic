/*
  Name: Daniel Urbina
  Date: 4/25/2024
  Course name and section: IT302-002
  Assignment Name: Phase 5
  Email: du35@njit.edu
*/

import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap'; 
import storiesDataService from "../services/storiesDataService";
import '../App.css'

const AddStory = (props) => {
    const [title, setTitle] = useState("")
    const [text, setText] = useState("")
    const [url, setUrl] = useState("")
    const [image, setImage] = useState("")
    const [submitted, setSubmitted] = useState(false)
    const navigate = useNavigate();

    const onTitleChange = (e) => setTitle(e.target.value)
    const onTextChange = (e) => setText(e.target.value)
    const onUrlChange = (e) => setUrl(e.target.value)
    const onImageChange = (e) => setImage(e.target.value)

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
                setSubmitted(true)
            })
            .catch(error => {
                console.log(error);
            });

        setTitle(""); setText(""); setUrl(""); setImage("")
        setTimeout(() => { navigate(`/du35_stories`) }, 2000)
    }

    const cardStyle = {
        maxWidth: "850px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        backgroundColor: "#f5f5f5",
    }

    return (
        <div>
            {submitted ? (
                <Alert variant="success">
                    Story submitted successfully!
                </Alert>
            ) : (
                <Form style={cardStyle}>
                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" onChange={onTitleChange} />
                        </Form.Group>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Text</Form.Label>
                        <Form.Control as="textarea" rows={3} onChange={onTextChange} />
                    </Form.Group>

                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Label>Story Url</Form.Label>
                            <Form.Control type="url" placeholder="Url (Optional)" onChange={onUrlChange} />
                        </Form.Group>

                        <Form.Group as={Col}>
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control type="url" placeholder="Url (Optional)" onChange={onImageChange} />
                        </Form.Group>
                    </Row>

                    <Button variant="dark" type="submit" onClick={handleSubmit}>Submit</Button>
                </Form>
            )}
        </div>
    );
}

export default AddStory;