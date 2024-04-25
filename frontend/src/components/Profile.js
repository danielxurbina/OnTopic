/*
  Name: Daniel Urbina
  Date: 4/25/2024
  Course name and section: IT302-002
  Assignment Name: Phase 5
  Email: du35@njit.edu
*/

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tab, Tabs, Row, Button } from "react-bootstrap";
import storiesDataService from "../services/storiesDataService";
import convertDate from "../utils/convertDate";
import '../App.css'

const Profile = () => {
    const [stories, setStories] = useState([]);
    const [comments, setComments] = useState([]);
    const [user, setUser] = useState({});
    const [key, setKey] = useState("stories")
    const navigate = useNavigate();
    let { id } = useParams();

    useEffect(() => {
        fetchUserInformation(id);
    }, [id])

    const fetchUserStories = async(storyIDs) => {
        const userStories = []
        for (const storyID of storyIDs){
            const storyResponse = await storiesDataService.getStory(storyID)
            userStories.push(storyResponse.data.story)
        }
        setStories(userStories)
    }

    const fetchUserComments = async(commentIDs) => {
        const userComments = []
        for (const commentID of commentIDs){
            const commentResponse = await storiesDataService.getComment(commentID)
            userComments.push(commentResponse.data)
        }
        setComments(userComments)
    }

    const fetchUserInformation = async (userID) => {
        try {
            const userResponse = await storiesDataService.getUser(userID);
            setUser(userResponse.data);
            const userStoriesIDs = []
            const userCommentsIDs = []
            for (const story of userResponse.data.stories) {
                userStoriesIDs.push(story)
            }
            for (const comment of userResponse.data.comments) {
                userCommentsIDs.push(comment)
            }

            await fetchUserStories(userStoriesIDs)
            await fetchUserComments(userCommentsIDs)
        } catch (e) {
            console.log(e)
        }
    }

    const handleCommentClick = async (comment) => {
        const parentID = comment.parent 
        try {
            const parentResponse = await storiesDataService.getStory(parentID)
            if (parentResponse.data.success === false) {
                const commentResponse = await storiesDataService.getComment(parentID)
                await handleCommentClick(commentResponse.data)
            } else {
                navigate(`/du35_stories/${parentID}`)
            }
        } catch (e) {
            console.error(e)
        }
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
        <div style={cardStyle}>
            <h1>{user.username}</h1>
            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3"
                justify
            >
                <Tab eventKey="stories" title="stories">
                    {stories && stories.map((story, index) => {
                        return (
                            <div key={index} style={cardStyle}>
                                <Row>
                                    <p>{convertDate(story.time)}</p>
                                    <h3>{story.title}</h3>
                                </Row>
                                <Button
                                    variant="dark"
                                    onClick={() => navigate(`/du35_stories/${story._id}`)}
                                >
                                    View Story
                                </Button>
                            </div>
                        )
                    })}
                </Tab>
                <Tab eventKey="comments" title="comments">
                    {comments && comments.map((comment, index) => (
                        comment.deleted ? null : (
                            <div key={index} style={cardStyle}>
                                <Row>
                                    <p>{convertDate(comment.time)}</p>
                                    <h3>{comment.text}</h3>
                                </Row>
                                <Button 
                                    variant="dark"
                                    onClick={() => handleCommentClick(comment)}
                                >
                                    View Comment
                                </Button>
                            </div>
                        )
                    ))}
                </Tab>
            </Tabs>
        </div>
    )
}

export default Profile;