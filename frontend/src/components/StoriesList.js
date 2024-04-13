/*
  Name: Daniel Urbina
  Date: 4/12/2024
  Course name and section: IT302-002
  Assignment Name: Phase 4
  Email: du35@njit.edu
*/

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CardImg from 'react-bootstrap/CardImg';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import convertDate from '../utils/convertDate';
import Form from 'react-bootstrap/Form';
import storiesDataService from "../services/storiesDataService";

const StoriesList = () => {
    const [stories, setStories] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllStories();
    }, [])

    const fetchAllStories = () => {
        storiesDataService.getAllStories()
            .then((response => {
                setStories(response.data.stories)
            }))
            .catch((error) => {
                console.log(error)
            })
    }

    const onChangeSearchTitle = (e) => {
        setSearchTitle(e.target.value);
    };

    const handleSearch = () => {
        if(searchTitle === ""){
            fetchAllStories()
        } else {
            storiesDataService.findStory(searchTitle)
                .then(response => {
                    setStories(response.data.stories)
                    setSearchTitle("")
                })
                .catch(error => {
                    console.log('Error finding story: ', error)
                })
        }
    }

    const handleStoryClick = (storyID) => {
        navigate(`/du35_stories/${storyID}`);
    }

    return (
        <div>
            <div>
                <Form>
                    <Row className="justify-content-center">
                        <Col sm={5} className="my-1">
                            <Form.Group>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Search by title" 
                                    value={searchTitle} 
                                    onChange={onChangeSearchTitle} 
                                    style={{ width: '100%' }} 
                                />
                            </Form.Group>
                        </Col>
                        <Col xs="auto" className="my-1">
                            <Button 
                                variant="primary" 
                                type="button" 
                                onClick={handleSearch}
                            >
                                Search
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div>
            <div style={{display: 'grid', placeItems: 'center',}}>
                {stories.map(story =>
                    <Card 
                        className="story-card" 
                        bg="dark" 
                        text="light" 
                        border="light" 
                        style={{ cursor: 'pointer', width: '50rem' }}
                    >
                        <Card.Header>Posted by 
                            <span className="username" onClick={() => navigate(`/du35_users/${story.user_id}`)}>{story.by}</span> {convertDate(story.lastUpdated)}
                        </Card.Header>
                        <Card.Body>
                            <Card.Title>{story.title}</Card.Title>
                            <Card.Text>{story.text}</Card.Text>
                            {story.image ? <CardImg variant="bottom" src={story.image} className="storyImage"/> : null}
                        </Card.Body>
                        <Card.Footer >
                            <Button 
                                variant="primary" 
                                onClick={() => handleStoryClick(story._id)} 
                                className="commentButton"
                            >
                                Add Comment
                            </Button>
                            <Card.Text>Comments: {story.descendants}</Card.Text>
                        </Card.Footer>
                    </Card>
                )}
            </div>
        </div>
    );
}

export default StoriesList;