/*
  Name: Daniel Urbina
  Date: 4/25/2024
  Course name and section: IT302-002
  Assignment Name: Phase 5
  Email: du35@njit.edu
*/

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Modal, Dropdown, DropdownButton, Form, Row, Col, Alert } from "react-bootstrap"
import { FaRegCommentAlt } from "react-icons/fa";
import CommentList from "./CommentList";
import storiesDataService from "../services/storiesDataService";
import convertDate from "../utils/convertDate";
import '../App.css'

const Story = (props) => {
    const [story, setStory] = useState(null);
    const [comments, setComments] = useState(null);
    const [showEditModal, setEditModal] = useState(false);
    const [showDeleteModal, setDeleteModal] = useState(false);
    const [title, setTitle] = useState(null)
    const [text, setText] = useState(null)
    const [url, setUrl] = useState(null)
    const [image, setImage] = useState(null)
    const [authorized, setAuthorized] = useState(false)
    const [deleted, setDeleted] = useState(false)
    const currentUser = props.currentUser;
    let { storyID } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchStoryAndComments(storyID);
    }, [storyID]);

    useEffect(() => {
        if (currentUser && (story?.user_id === currentUser.id || currentUser.role === 'admin')) {
            setAuthorized(true);
            console.log('Authorized: ', authorized)
        }
    }, [story])

    const handleEditModal = () => setEditModal(true);
    const handleDeleteModal = () => setDeleteModal(true);
    const handleCloseDeleteModal = () => setDeleteModal(false);
    const handleCloseEditModal = () => setEditModal(false);

    const onChangeTitle = (e) => setTitle(e.target.value);
    const onChangeText = (e) => setText(e.target.value);
    const onChangeUrl = (e) => setUrl(e.target.value);
    const onChangeImage = (e) => setImage(e.target.value);

    const openEditModal = () => handleEditModal();
    const openDeleteModal = () => handleDeleteModal();
    const closeDeleteModal = () => {
        handleCloseDeleteModal();
        setDeleted(true)
    }

    const fetchStoryAndComments = async (storyID) => {
        try {
            const storyResponse = await storiesDataService.getStory(storyID);
            const commentsResponse = await getComments(storyResponse.data.story);
            setStory(storyResponse.data.story)
            setComments(commentsResponse)
            storyResponse.data.story.title ? setTitle(storyResponse.data.story.title) : setTitle('')
            storyResponse.data.story.text ? setText(storyResponse.data.story.text) : setText('')
            storyResponse.data.story.url ? setUrl(storyResponse.data.story.url) : setUrl('')
            storyResponse.data.story.image ? setImage(storyResponse.data.story.image) : setImage('')
        } catch (e) {
            console.log('Error fetching story and comments: ', e)
        }
    }

    const getComments = async (comments, level = 0) => {
        if (!comments.kids || comments.kids.length === 0) {
            console.log('No comments to get')
            return [];
        }

        const commentResult = [];

        for (const commentID of comments.kids) {
            const commentObject = {
                comment: {},
                level: level,
                kids: []
            }

            try {
                const response = await storiesDataService.getComment(commentID);
                commentObject.comment = response.data;
                if (response.data.kids.length > 0) {
                    const nestedComments = await getComments(response.data, level + 1);
                    commentObject.kids = nestedComments;
                }
                commentResult.push(commentObject);
            } catch (error) {
                console.error("Error fetching comment:", error);
            }
        }

        return commentResult;
    }

    const handleUrlSwitch = (url) => {
        if (url) {
            window.location.href = url;
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (story.user_id !== currentUser.id && currentUser.role !== 'admin') {
            alert('You are not authorized to edit this story')
            return
        }
        const storyObj = {
            story_id: storyID,
            user_id: story.user_id,
            by: story.by,
            title: title !== "" ? title : "",
            text: text !== "" ? text : "",
            url: url !== "" ? url : "",
            image: image !== "" ? image : ""
        }

        storiesDataService.updateStory(storyObj)
            .then(response => {
                console.log('Story updated: ', response.data);
                fetchStoryAndComments(storyID); // Fetch updated story and comments
                handleCloseEditModal();
            })
            .catch(error => {
                console.log(error);
            });
    }

    const handleDelete = (e) => {
        e.preventDefault();
        if (story.by !== currentUser.username && currentUser.role !== 'admin') {
            console.log('User is not authorized to delete this story')
            alert('You are not authorized to delete this story')
            return
        }
        const storyObj = {
            story_id: storyID,
            user_id: story.user_id
        }

        storiesDataService.deleteStory(storyObj)
            .then(response => {
                console.log('Story deleted: ', response.data);
                closeDeleteModal()
            })
            .catch(error => {
                console.log(error);
            })

        setTimeout(() => {
            navigate('/du35_stories')
        }, 2500)
    }

    const handleButtonClick = () => {
        props.currentUser !== undefined ? (
            navigate(`/du35_stories/${storyID}/comment`, { state: { currentUser: props.currentUser } })
        ) : (
            navigate('/du35_login', { state: { error: true } })
        )
    }

    const cardStyle = {
        width: "850px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        backgroundColor: "#f5f5f5",
    }

    return (
        <div>
            {deleted ? (
                <Alert variant="success" style={{ textAlign: 'center', marginTop: '20px' }}>
                    Story successfully deleted!
                </Alert>
            ) : (
                <div className="story-wrapper">
                    <Card text="dark" style={cardStyle}>
                        <Row>
                            <Col style={{ margin: 'auto', maxWidth: 'fit-content' }}>
                                Posted by <span className="username" onClick={() => navigate(`/du35_profile/${story.user_id}`)} style={{ cursor: "pointer" }}>{story?.by}</span> {convertDate(story?.time)}
                            </Col>
                            <Col style={{ "maxWidth": "fit-content" }}>
                                {authorized ? (
                                    <DropdownButton 
                                        variant="dark" 
                                        id="dropdown-no-caret" 
                                        title="..." 
                                        style={{ float: 'right' }}
                                    >
                                        <Dropdown.Item as="button" onClick={openEditModal}>Edit</Dropdown.Item>
                                        <Dropdown.Item as="button" onClick={openDeleteModal}>Delete</Dropdown.Item>
                                    </DropdownButton>
                                ) : null}
                            </Col>
                        </Row>
                        <Card.Body>
                            <Row>
                                <Card.Title
                                    onClick={() => handleUrlSwitch(story?.url)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {story?.title}
                                </Card.Title>
                            </Row>
                            {story?.text && <Card.Text>{story?.text}</Card.Text>}
                            <Row>
                                <Card.Img 
                                    variant="top" 
                                    src={story?.image} 
                                    className="story-image" 
                                />
                            </Row>
                            <Row style={{ marginTop: '10px' }}>
                                <Col>
                                    <Button
                                        variant="dark"
                                        onClick={handleButtonClick}
                                    >
                                        <FaRegCommentAlt /> {story?.descendants - story?.deletedCount}
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <Modal show={showEditModal} onHide={handleCloseEditModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Story</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formGridTitle">
                                        <Form.Label>Title</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            value={title} 
                                            onChange={onChangeTitle} 
                                        />
                                    </Form.Group>
                                </Row>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formGridText">
                                        <Form.Label>Text</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            as="textarea" 
                                            value={text} 
                                            onChange={onChangeText} 
                                        />
                                    </Form.Group>
                                </Row>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formGridUrl">
                                        <Form.Label>Url</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            value={url} 
                                            onChange={onChangeUrl} 
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="formGridUrl">
                                        <Form.Label>Image Url</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            value={image} 
                                            onChange={onChangeImage} 
                                        />
                                    </Form.Group>
                                </Row>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseEditModal}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleSubmit}>
                                Save Edits
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Delete Story?</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Are you sure you want to delete your story? You can't undo this.
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseDeleteModal}>
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={handleDelete}>
                                Delete
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <div>
                        {comments && comments.length > 0 &&
                            <Row
                                className="justify-content-center"
                                style={{
                                    width: "850px",
                                    margin: "20px auto",
                                    padding: "20px",
                                    border: "1px solid #ddd",
                                    borderRadius: "10px",
                                    backgroundColor: "#EFEFEF"
                                }}
                            >
                                {comments && comments?.map((comment) => (
                                    <CommentList
                                        storyID={storyID}
                                        currentUser={props.currentUser}
                                        comment={comment.comment}
                                        kids={comment.kids}
                                        level={0}
                                    />
                                ))}
                            </Row>
                        }
                    </div>
                </div>
            )}
        </div>
    );
}

export default Story;