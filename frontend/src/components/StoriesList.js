/*
  Name: Daniel Urbina
  Date: 4/25/2024
  Course name and section: IT302-002
  Assignment Name: Phase 5
  Email: du35@njit.edu
*/

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardImg, Row, Col, Form } from "react-bootstrap";
import { FaRegCommentAlt } from "react-icons/fa";
import storiesDataService from "../services/storiesDataService";
import convertDate from '../utils/convertDate';
import PaginationComponent from './Pagination'
import '../App.css'

const StoriesList = () => {
    const [stories, setStories] = useState([]);
    const [totalStories, setTotalStories] = useState(0);
    const [searchTitle, setSearchTitle] = useState("");
    const [currentPage, setCurrentPage] = useState(0)
    const [entriesPerPage, setEntriesPerPage] = useState(0)
    const [currentSearchMode, setCurrentSearchMode] = useState("")
    const navigate = useNavigate();

    useEffect(() => {
        setCurrentPage(0)
    }, [currentSearchMode])

    useEffect(() => {
        fetchAllStories()
    }, [])

    useEffect(() => {
        retrieveNextPage()
    }, [currentPage])

    const fetchAllStories = () => {
        try {
            storiesDataService.getAllStories(currentPage, 10)
                .then((response => {
                    setEntriesPerPage(response.data.entries_per_page)
                    setCurrentPage(response.data.page)
                    setStories(response.data.stories)
                    setTotalStories(response.data.total_results)
                }))
                .catch((e) => {
                    console.log('Error in fetchAllStories: ', e)
                })
        }
        catch (e) {
            console.log('Error fetching all stories: ', e)
        }
    }

    const retrieveNextPage = () => {
        if (currentSearchMode === "findByTitle") {
            setCurrentSearchMode("findByTitle")
            findByTitle()
        } else {
            fetchAllStories()
        }
    }

    const find = (query, by) => {
        storiesDataService.findStory(query, by)
            .then((response) => {
                console.log('Result of find: ', response.data.stories)
                setEntriesPerPage(response.data.entries_per_page)
                setCurrentPage(response.data.page)
                setStories(response.data.stories)
                setTotalStories(response.data.total_results)
            })
            .catch((e) => {
                console.log('Error in find: ', e)
            })
    }

    const onChangeSearchTitle = (e) => setSearchTitle(e.target.value);
    const findByTitle = () => { find(searchTitle, "title") }
    const handlePagination = (pageNumber) => setCurrentPage(pageNumber - 1);
    const handleNext = () => setCurrentPage(currentPage + 1);
    const handlePrev = () => setCurrentPage(currentPage - 1);
    const handleStoryClick = (storyID) => navigate(`/du35_stories/${storyID}`);
    const handleUrlSwitch = (url) => { if (url) window.location.href = url; }

    const cardStyle = {
        width: "850px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        backgroundColor: "#f5f5f5",
    }

    return (
        <div className="storiesList-wrapper">
            <div className="form-wrapper">
                <Form style={{ marginTop: "10px" }}>
                    <Row>
                        <Col className="my-1">
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
                                variant="dark"
                                type="button"
                                onClick={findByTitle}
                            >
                                Search
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div>
            <div className="story-wrapper">
                {stories?.map(story =>
                    <Card text="dark" key={story._id} style={cardStyle}>
                        <Row>
                            <Col style={{ margin: 'auto', maxWidth: 'fit-content' }}>
                                Posted by <span className="username" onClick={() => navigate(`/du35_profile/${story.user_id}`)} style={{ cursor: "pointer" }}> {story.by}</span> {convertDate(story.time)}
                            </Col>
                        </Row>
                        <Card.Body>
                            <Row>
                                <Card.Title
                                    onClick={() => handleUrlSwitch(story.url)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {story.title}
                                </Card.Title>
                            </Row>
                            <Card.Text>{story.text}</Card.Text>
                            <Row>
                                {story.image ?
                                    (story.image.includes('webp') ?
                                        <CardImg
                                            variant="bottom"
                                            src={story.image}
                                            className="storyImage"
                                            type="image/webp"
                                        />
                                        :
                                        <CardImg
                                            variant="bottom"
                                            src={story.image}
                                            className="storyImage"
                                        />
                                    ) : null
                                }
                            </Row>
                            <Row style={{ marginTop: '10px' }}>
                                <Col>
                                    <Button
                                        variant="dark"
                                        onClick={() => handleStoryClick(story._id)}
                                    >
                                        <FaRegCommentAlt /> {story.descendants - story.deletedCount}
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                )}
                <PaginationComponent
                    postsPerPage={entriesPerPage}
                    length={totalStories}
                    currentPage={currentPage}
                    handlePagination={handlePagination}
                    handleNext={handleNext}
                    handlePrev={handlePrev}
                />
            </div>
        </div>
    );
}

export default StoriesList;