import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom"
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import storiesDataService from "../services/storiesDataService";

const AddComment = (props) => {
    let editing = false;
    let initialCommentState = '';
    let location = useLocation();
    let { storyID } = useParams();
    const navigate = useNavigate();

    if (location.state && location.state.comment) {
        editing = true;
        initialCommentState = location.state.comment.text;
    }
    const [comment, setComment] = useState(initialCommentState);
    const [submitted, setSubmitted] = useState(false)
    let currentUser = location.state.currentUser;

    const onChangeComment = e => setComment(e.target.value);

    const handleSubmit = (e) => {
        e.preventDefault();
        let commentObj = {}
        if (editing === true) {
            commentObj = {
                comment_id: location.state.comment.id,
                user_id: location.state.comment.user_id,
                text: comment
            }

            storiesDataService.updateComment(commentObj)
                .then(response => {
                    console.log('Comment updated: ', response.data);
                    setSubmitted(true)
                })
                .catch(error => {
                    console.log(error);
                })
            setTimeout(() => { navigate(`/du35_stories/${storyID}`) }, 2000)
        } else {
            commentObj = {
                by: currentUser.username,
                user_id: currentUser.id,
                parent: location.state.parent ? location.state.parent.id : storyID,
                text: comment
            }

            storiesDataService.createComment(commentObj)
                .then(response => {
                    console.log('Comment created: ', response.data);
                    setSubmitted(true)
                })
                .catch(error => {
                    console.log(error);
                })
            setTimeout(() => { navigate(`/du35_stories/${storyID}`) }, 2000)
        }
    }

    const formStyle = {
        maxWidth: "600px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        backgroundColor: "#f5f5f5",
    }

    return (
        <div>
            {submitted ? (
                (editing ? (
                    <Alert variant="success">
                        <Alert.Heading>Comment updated successfully!</Alert.Heading>
                        <p>Redirecting back to story...</p>
                    </Alert>
                ) : (
                    <Alert variant="success">
                        <Alert.Heading>Comment submitted successfully!</Alert.Heading>
                        <p>Redirecting back to story...</p>
                    </Alert>
                ))
            ) : (
                <Container>
                    <Row className="justify-content-center">
                        <Col md={6} style={formStyle}>
                            <h3 style={{ marginTop: '10px' }}>{editing ? "Edit Comment" : "Add Comment"}</h3>
                            <p>{editing ? null : (location.state.parent ? location.state.parent.text : null)}</p>
                            <Form>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formGroupComment">
                                        <Form.Control
                                            required
                                            as="textarea"
                                            placeholder="What are your thoughts?"
                                            rows={3}
                                            value={comment}
                                            onChange={onChangeComment}
                                        />
                                    </Form.Group>
                                </Row>
                                <Button
                                    variant="dark"
                                    disabled={submitted}
                                    onClick={!submitted ? handleSubmit : null}
                                >
                                    {submitted ? 'Loading...' : (editing ? 'Save Changes' : 'Comment')}
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            )}
        </div>
    );
}

export default AddComment;