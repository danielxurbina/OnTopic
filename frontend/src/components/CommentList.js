/*
  Name: Daniel Urbina
  Date: 4/25/2024
  Course name and section: IT302-002
  Assignment Name: Phase 5
  Email: du35@njit.edu
*/

import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import { FaRegCommentAlt } from "react-icons/fa";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import storiesDataService from "../services/storiesDataService";
import convertDate from '../utils/convertDate';

const CommentList = (props) => {
    const currentUser = props.currentUser;
    const isAdmin = currentUser?.role === 'admin';
    const navigate = useNavigate();
    const canEditOrDelete = currentUser && (currentUser.id === props.comment.user_id || isAdmin);

    const handleDelete = (commentID, userID) => {
        let deleteObject = { comment_id: commentID, user_id: userID }

        storiesDataService.deleteComment(deleteObject)
            .then(response => {
                console.log('Comment deleted: ', response)
                window.location.reload()
            })
            .catch(error => {
                console.log('Error deleting comment: ', error)
            })
    }

    const handleButtonClick = (type) => {
        if(props.currentUser){
            if(type === 'reply'){
                navigate(`/du35_stories/${props.storyID}/comment`, {
                    state: {
                        parent: {
                            id: props.comment._id,
                            text: props.comment.text
                        },
                        currentUser: currentUser
                    }
                })
            } else if(type === 'edit'){
                navigate(`/du35_stories/${props.storyID}/comment`, {
                    state: {
                        comment: {
                            id: props.comment._id,
                            text: props.comment.text,
                            by: props.comment.by,
                            user_id: props.comment.user_id,
                            parent: props.comment.parent
                        },
                        currentUser: currentUser
                    }
                })
            }
        } else {
            navigate('/du35_login', {state: {error: true}})
        }
    }

    return (
        <>
            <div className="d-flex flex-start mb-4">
                {props.comment.deleted && props.comment.kids.length >= 3 ? (
                    <Card className="w-100" bg="light" text="dark">
                        <Card.Body className="py-4">
                            <div>
                                <h5>[deleted]</h5>
                                <p className="small">{convertDate(props.comment.time)}</p>
                                <p>[deleted]</p>
                            </div>
                        </Card.Body>
                    </Card>
                ) : !props.comment.deleted && (
                    <Card className="w-100" bg="light" text="dark">
                        <Card.Body className="py-4">
                            <div>
                                <h5>{props.comment.by}</h5>
                                <p className="small">{convertDate(props.comment.time)}</p>
                                <p>{props.comment.text}</p>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <Button
                                            variant="primary"
                                            onClick={() => handleButtonClick('reply')}
                                        >
                                            <FaRegCommentAlt /> Reply
                                        </Button>
                                        {canEditOrDelete && (
                                            <>
                                                <Button
                                                    variant="info"
                                                    onClick={() => handleButtonClick('edit')}
                                                >
                                                    <MdOutlineEdit /> Edit
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    onClick={() => handleDelete(props.comment._id, props.comment.user_id, props.updateDescendantsCount)}
                                                >
                                                    <MdDeleteOutline /> Delete
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                )}
            </div>
            <div style={{ paddingLeft: 35 }}>
                {props.kids && props.kids.map((nestedComment, index) => (
                    <CommentList
                        key={index}
                        comment={nestedComment.comment}
                        kids={nestedComment.kids}
                        currentUser={currentUser}
                        storyID={props.storyID}
                        level={props.level + 1}
                    />
                ))}
            </div>
        </>
    );
};

export default CommentList;