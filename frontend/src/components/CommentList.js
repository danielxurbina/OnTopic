/*
  Name: Daniel Urbina
  Date: 4/12/2024
  Course name and section: IT302-002
  Assignment Name: Phase 4
  Email: du35@njit.edu
*/

import React from "react";
import Card from 'react-bootstrap/Card';
import convertDate from '../utils/convertDate';
import { FaReply } from "react-icons/fa";

const CommentList = (props) => {
    return (
        <>
            <div className="d-flex flex-start mb-4">
                <Card className="w-100" bg="dark" text="light">
                    <Card.Body className="py-4">
                        <div>
                            <h5>{props.comment.by}</h5>
                            <p className="small">{convertDate(props.comment.time)}</p>
                            <p>
                                {props.comment.text}
                            </p>

                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <FaReply />
                                    Reply
                                </div>
                                <a href="#!" className="link-muted">
                                </a>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>
            <div style={{ paddingLeft: 25 }}>
                {props.kids && props.kids.map((nestedComment, index) => (
                    <CommentList key={index} comment={nestedComment.comment} kids={nestedComment.kids} currentUser={props.currentUser} />
                ))}
            </div>
        </>
    );
};

export default CommentList;