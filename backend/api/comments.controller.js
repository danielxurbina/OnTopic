import CommentsDAO from "../dao/commentsDAO.js";
import StoriesDAO from "../dao/storiesDAO.js";
import UsersDAO from "../dao/usersDAO.js";
import mongodb from "mongodb";
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
      console.log('ID: ', id)
      const comment = await CommentsDAO.getCommentByID(id);
      console.log('Comment: ', comment)
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
      const postFields = {
        by: req.body.by,
        user_id: new ObjectId(req.body.user_id),
        kids: [],
        parent: new ObjectId(req.body.parent),
        text: req.body.text,
        time: new Date(),
        type: "comment",
        lastModified: new Date()
      };

      const persistedUser = req.user
      if (persistedUser._id.equals(postFields.user_id) || persistedUser.role === "admin") {
        const parentID = req.body.parent;
        const getCommentResponse = await CommentsDAO.getCommentByID(parentID);
        const getStoryResponse = await StoriesDAO.getStoryByID(parentID);

        if (getCommentResponse == null) {
          // if the parentID is a story then we need to add the comment to the comments collection
          // and update the story kids array with the newly added comment id and increment the story descendants count by 1
          const addCommentResponse = await CommentsDAO.addComment(postFields);
          const commentID = addCommentResponse.insertedId;
          const updateResponse = await StoriesDAO.updateStoryWithComment(parentID, commentID);
          const updateUserResponse = await UsersDAO.updateUser({ _id: new ObjectId(req.body.user_id) }, null, null, commentID);
          res.json({ addCommentResponse, updateResponse, updateUserResponse });
        } else if (getCommentResponse && getStoryResponse == null) {
          // if the parentID is a comment then we need to add the comment to the comments collection
          // and update the comment kids array with the newly added comment id and increment the story descendants count by 1 
          // by going up the parent chain recursively to reach the story to update the descendants count
          const addCommentResponse = await CommentsDAO.addComment(postFields);
          const commentID = addCommentResponse.insertedId;
          const updateCommentResponse = await CommentsDAO.updateCommentWithComment(parentID, commentID);
          const updateStoryResponse = await StoriesDAO.updateStoryDescendants(parentID);
          const updateUserResponse = await UsersDAO.updateUser({ _id: new ObjectId(req.body.user_id) }, null, null, commentID);
          res.json({ addCommentResponse, updateCommentResponse, updateStoryResponse, updateUserResponse });
        } else {
          res.json({ error: "ParentID is not a story or a comment" });
        }
      } else {
        res.status(401).json({ error: "User is not authorized to create a comment for another user" });
      }
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  // Method to update a comment
  static async apiUpdateComment(req, res, next) {
    try {
      let query = { _id: new ObjectId(req.body.comment_id), user_id: new ObjectId(req.body.user_id) };
      let updateFields = {
        text: req.body.text,
        lastModified: new Date()
      };
      const persistedUser = req.user;
      if (persistedUser._id.equals(query.user_id) || persistedUser.role === "admin") {
        const updateResponse = await CommentsDAO.updateComment(query, updateFields);
        res.json({ updateResponse });
      } else {
        res.status(401).json({ error: "User is not authorized to update another user's comment" });
      }
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
      let query = { _id: new ObjectId(req.body.comment_id), user_id: new ObjectId(req.body.user_id) };
      let updateFields = { deleted: true, lastModified: new Date() };
      console.log('Query: ', query)
      console.log('Update Fields: ', updateFields)
      const persistedUser = req.user;
      if (persistedUser._id.equals(query.user_id) || persistedUser.role === "admin") {
        console.log('User is authorized to delete comment');
        // After the comment is soft deleted, we need to update the deletedCount field in the stories collection
        // So we need to go up the parent chain recursively to reach the story to update the deletedCount field
        const commentResponse = await CommentsDAO.updateComment(query, updateFields);
        const updateStoryResponse = await StoriesDAO.updateStoryDeletedCount(query._id);
        console.log('Comment Response: ', commentResponse)
        res.json({ commentResponse, updateStoryResponse });
      } else {
        console.log('User is not authorized to delete comment');
        res.status(401).json({ error: "User is not authorized to delete another user's comment" });
      }
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}