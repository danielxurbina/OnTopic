/*
  Name: Daniel Urbina
  Date: 3/22/2024
  Course name and section: IT302-002
  Assignment Name: Phase 3
  Email: du35@njit.edu
*/

import express from "express";
import StoriesController from "./stories.controller.js";
import CommentsController from "./comments.controller.js";

const router = express.Router();

// Story Routes
router
  .route("/")
  .get(StoriesController.apiGetStories)
  .post(StoriesController.apiPostStory)
  .put(StoriesController.apiUpdateStory)
  .delete(StoriesController.apiDeleteStory);

router.route('/id/:id')
  .get(StoriesController.apiGetStoryByID);

// Comment Routes
router
  .route("/comments")
  .get(CommentsController.apiGetComments)
  .post(CommentsController.apiPostComment)
  .put(CommentsController.apiUpdateComment)

router.route('/comments/id/:id')
  .get(CommentsController.apiGetCommentByID);

router.route("/comments/soft-delete")
  .put(CommentsController.apiSoftDeleteComment);

export default router;