/*
  Name: Daniel Urbina
  Date: 3/22/2024
  Course name and section: IT302-002
  Assignment Name: Phase 3
  Email: du35@njit.edu
*/

import CommentsDAO from "../dao/commentsDAO.js";
import StoriesDAO from "../dao/storiesDAO.js";
import mongodb from "mongodb";
import UniqueID from "../lib/uniqueID.js";
const ObjectId = mongodb.ObjectId;

export default class CommentsController {
  // Method to get comments
  static async apiGetComments(req, res, next) {
    try {
      const commentsPerPage = req.query.commentsPerPage ? parseInt(req.query.commentsPerPage) : 20;
      const page = req.query.page ? parseInt(req.query.page) : 0;
      let filters = {};

      if (req.query.by) {
        filters.by = req.query.by;
      } else if (req.query.parent) {
        filters.parent = req.query.parent;
      } else if (req.query.text) {
        filters.text = req.query.text;
      }

      const { commentsList, totalNumComments } = await CommentsDAO.getComments({
        filters,
        page,
        commentsPerPage
      });
      let response = {
        comments: commentsList,
        page: page,
        filters: filters,
        entries_per_page: commentsPerPage,
        total_results: totalNumComments
      };
      res.json(response);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  // Method to get a comment by its ID
  static async apiGetCommentByID(req, res, next) {
    try {
      const id = req.params.id || {};
      const comment = await CommentsDAO.getCommentByID(id);
      if (!comment) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(comment);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e.message })
    }
  }

  // Method to create a comment
  static async apiPostComment(req, res, next) {
    try {
      const postFields = {};
      postFields.by = req.body.by;
      req.body.user_id ? postFields.user_id = req.body.user_id : postFields.user_id = await UniqueID.getNextSequenceValue("user_id");
      postFields.kids = [];
      postFields.parent = req.body.parent;
      postFields.text = req.body.text;
      postFields.time = new Date();
      postFields.type = "comment";
      postFields.lastModified = new Date();

      const parentID = req.body.parent;
      const getCommentResponse = await CommentsDAO.getCommentByID(parentID);
      const getStoryResponse = await StoriesDAO.getStoryByID(parentID);

      if (getCommentResponse == null) {
        // if the parentID is a story then we need to add the comment to the comments collection
        // and update the story kids array with the newly added comment id and increment the story descendants count by 1
        const addCommentResponse = await CommentsDAO.addComment(postFields);
        const commentID = addCommentResponse.insertedId;
        const updateResponse = await StoriesDAO.updateStoryWithComment(parentID, commentID);
        res.json({ addCommentResponse, updateResponse });
      } else if (getCommentResponse && getStoryResponse == null) {
        // if the parentID is a comment then we need to add the comment to the comments collection
        // and update the comment kids array with the newly added comment id and increment the story descendants count by 1 
        // by going up the parent chain recursively to reach the story to update the descendants count
        const addCommentResponse = await CommentsDAO.addComment(postFields);
        const commentID = addCommentResponse.insertedId;
        const updateCommentResponse = await CommentsDAO.updateCommentWithComment(parentID, commentID);
        const updateStoryResponse = await StoriesDAO.updateStoryDescendants(parentID);
        res.json({ addCommentResponse, updateCommentResponse, updateStoryResponse });
      } else {
        res.json({ error: "ParentID is not a story or a comment" });
      }
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  // Method to update a comment
  static async apiUpdateComment(req, res, next) {
    try {
      let query = { _id: new ObjectId(req.body.comment_id), user_id: req.body.user_id };
      let updateFields = {};
      updateFields.text = req.body.text
      updateFields.lastModified = new Date();
      const updateResponse = await CommentsDAO.updateComment(query, updateFields);
      res.json({ updateResponse: updateResponse });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  // This method is used to soft delete a comment
  /*
    Since the API allows nested comments, we don't want to delete the whole comment chain
    so we will use a soft delete to avoid deleting the whole comment chain.

    The soft delete will set the deleted field to true and update the lastModified field.
  */
  static async apiSoftDeleteComment(req, res, next) {
    try {
      let query = { _id: new ObjectId(req.body.comment_id), user_id: req.body.user_id };
      let updateFields = { deleted: true, lastModified: new Date() };
      const commentResponse = await CommentsDAO.updateComment(query, updateFields);
      res.json({ commentResponse });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}