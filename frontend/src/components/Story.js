/*
  Name: Daniel Urbina
  Date: 4/12/2024
  Course name and section: IT302-002
  Assignment Name: Phase 4
  Email: du35@njit.edu
*/

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from 'react-bootstrap/Col';
import Card from "react-bootstrap/esm/Card";
import CardHeader from "react-bootstrap/esm/CardHeader";
import CardBody from "react-bootstrap/esm/CardBody";
import CardImg from "react-bootstrap/esm/CardImg";
import CardText from "react-bootstrap/esm/CardText";
import CardTitle from "react-bootstrap/esm/CardTitle";
import CommentList from "./CommentList";
import storiesDataService from "../services/storiesDataService";
import convertDate from "../utils/convertDate";

const Story = (props) => {
    const [story, setStory] = useState(null);
    const [comments, setComments] = useState(null);
    let { storyID } = useParams();

    useEffect(() => {
        fetchStoryAndComments(storyID);
    }, [storyID]);

    const fetchStoryAndComments = async (storyID) => {
        try {
            const storyResponse = await storiesDataService.getStory(storyID);
            const commentsResponse = await getComments(storyResponse.data.story);
            setStory(storyResponse.data.story);
            setComments(commentsResponse);
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


    return (
        <div style={{ display: 'grid', placeItems: 'center', height: '65vh' }}>
            <Card bg="dark" text="light" border="light" style={{ width: '50rem' }}>
                <CardHeader>
                    <Row>
                        <Col>
                            Posted by <span className="username">{story?.by}</span> {convertDate(story?.lastUpdated)}
                        </Col>
                    </Row>
                </CardHeader>
                <CardBody>
                    <Row>
                        <CardTitle 
                            onClick={() => handleUrlSwitch(story?.url)} 
                            style={{ cursor: 'pointer' }}
                        >
                            {story?.title}
                        </CardTitle>
                    </Row>
                    {story?.text && <CardText>{story?.text}</CardText>}
                    <Row>
                        <CardImg variant="top" src={story?.image} className="story-image" />
                    </Row>
                </CardBody>
                <Card.Footer>
                    <Row>
                        <Col>
                            {story?.descendants} Comments
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>

            <section className="vh-100">
                <Container className="py-5" style={{ maxWidth: "1000px" }}>
                    <Row className="justify-content-center">
                        <Col md="11" lg="9" xl="7">
                            {comments && comments.map((comment, index) => (
                                <CommentList 
                                    key={index} 
                                    comment={comment.comment} 
                                    kids={comment.kids} 
                                    currentUser={props.currentUser} 
                                />
                            ))}
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
}

export default Story;