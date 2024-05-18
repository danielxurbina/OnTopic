import express from "express";
import StoriesController from "./stories.controller.js";
import CommentsController from "./comments.controller.js";
import UsersController from "./users.controller.js";
import authenticate from "../middlewares/authMiddleware.js";

const router = express.Router();

// Story Routes
router
  .route("/")
  .get(StoriesController.apiGetStories)
  .post(authenticate, StoriesController.apiPostStory)
  .put(authenticate, StoriesController.apiUpdateStory)
  .delete(authenticate, StoriesController.apiDeleteStory);

router.route('/id/:id')
  .get(StoriesController.apiGetStoryByID);

// Comment Routes
router
  .route("/comments")
  .get(CommentsController.apiGetComments)
  .post(authenticate, CommentsController.apiPostComment)
  .put(authenticate, CommentsController.apiUpdateComment)

router.route('/comments/id/:id')
  .get(CommentsController.apiGetCommentByID);

router.route("/comments/soft-delete")
  .put(authenticate, CommentsController.apiSoftDeleteComment);

// User Routes
router
  .route("/users")
  .get(UsersController.apiGetUsers)
  .post(UsersController.apiPostUser)
  .put(authenticate, UsersController.apiUpdateUser)
  .delete(authenticate, UsersController.apiDeleteUser);

router.route('/users/id/:id')
  .get(UsersController.apiGetUserByID);

// Login Route
router.route('/users/login')
  .post(UsersController.apiLoginUser);

export default router;