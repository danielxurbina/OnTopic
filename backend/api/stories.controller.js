/*
  Name: Daniel Urbina
  Date: 4/25/2024
  Course name and section: IT302-002
  Assignment Name: Phase 5
  Email: du35@njit.edu
*/

import StoriesDAO from "../dao/storiesDAO.js";
import UsersDAO from "../dao/usersDAO.js";
import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

export default class StoriesControllers {
  // Method to get stories
  static async apiGetStories(req, res, next) {
    const storiesPerPage = req.query.storiesPerPage ? parseInt(req.query.storiesPerPage) : 20;
    const page = req.query.page ? parseInt(req.query.page) : 0;
    let filters = {};

    if (req.query.by) {
      filters.by = req.query.by;
    } else if (req.query.descendants) {
      filters.descendants = req.query.descendants;
    } else if (req.query.score) {
      filters.score = req.query.score;
    } else if (req.query.title) {
      filters.title = req.query.title;
    } else if (req.query.text) {
      filters.text = req.query.text;
    } else if (req.query.kids) {
      filters.kids = req.query.kids;
    }

    const { storiesList, totalNumStories } = await StoriesDAO.getStories({
      filters,
      page,
      storiesPerPage,
    });
    let response = {
      stories: storiesList,
      page: page,
      filters: filters,
      entries_per_page: storiesPerPage,
      total_results: totalNumStories,
    };
    res.json(response);
  }

  // Method to get a story by its ID
  static async apiGetStoryByID(req, res, next) {
    try {
      const id = req.params.id || {};
      const story = await StoriesDAO.getStoryByID(id);
      console.log('Story Response: ', story)
      if (!story) {
        res.json({ success: false, error: "Not found" })
        return;
      }
      res.json({ success: true, story });
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ sucess: false, error: e.message });
    }
  }

  // Method to create a story
  static async apiPostStory(req, res, next) {
    try {
      const getUserResponse = await UsersDAO.getUserByUsername(req.body.by);
      if (getUserResponse == null) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      const postFields = {};
      postFields.by = req.body.by;
      postFields.user_id = new ObjectId(getUserResponse._id);
      postFields.descendants = 0;
      postFields.deletedCount = 0;
      postFields.score = 0;
      postFields.text = req.body.text;
      postFields.time = new Date();
      postFields.title = req.body.title;
      postFields.type = "story";
      req.body.url ? postFields.url = req.body.url : postFields.url = "";
      req.body.image ? postFields.image = req.body.image : postFields.image = "";
      postFields.lastUpdated = new Date();
      postFields.kids = [];

      // Check if the user is an admin
      const persistedUser = req.user
      // Check if the req.body.by is the same as the username, if it's not the same then check if the user is an admin
      // If the user is not an admin and the req.body.by is not the same as the username, then return an error since
      // the user is not authorized to create a story for another user
      if (persistedUser._id.equals(postFields.user_id) || persistedUser.role === "admin") {
        console.log('User is authorized to create a story')
        const storyResponse = await StoriesDAO.addStory(postFields);
        // Update user with new story
        const updateUserResponse = await UsersDAO.updateUser({ _id: new ObjectId(persistedUser._id) }, null, storyResponse.insertedId);
        res.json({ success: true, storyResponse, updateUserResponse });
      } else {
        console.log('User is not authorized to create a story for another user')
        res.status(401).json({ error: "User is not authorized to create a story for another user" });
      }
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }

  // Method to update a story
  static async apiUpdateStory(req, res, next) {
    try {
      let query = { _id: new ObjectId(req.body.story_id) };
      console.log(req.body)
      let updateFields = {};
      req.body.by ? (updateFields.by = req.body.by) : null;
      req.body.descendants ? (updateFields.descendants = req.body.descendants) : null;
      req.body.deletedCount ? (updateFields.deletedCount = req.body.deletedCount) : null;
      req.body.score ? (updateFields.score = req.body.score) : null;
      req.body.text ? (updateFields.text = req.body.text) : null;
      req.body.title ? (updateFields.title = req.body.title) : null;
      req.body.url || req.body.image === "" ? (updateFields.url = req.body.url) : null;
      req.body.image || req.body.image === "" ? (updateFields.image = req.body.image) : null;
      updateFields.lastUpdated = new Date();

      const persistedUser = req.user;
      if (persistedUser._id.equals(req.body.user_id) || persistedUser.role === "admin") {
        const updateResponse = await StoriesDAO.updateStory(query, updateFields);
        res.json({ success: true, updateResponse });
      } else {
        res.status(401).json({ error: "User is not authorized to update another user's story" });
      }
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }

  // Method to delete a story
  static async apiDeleteStory(req, res, next) {
    try {
      const storyID = req.body.story_id;
      // Get the story from the database
      const story = await StoriesDAO.getStoryByID(storyID);
      const persistedUser = req.user;
      console.log('Inside apiDeleteStory - Persisted User: ', persistedUser)
      if (persistedUser.username !== story.by && persistedUser.role !== "admin") {
        res.status(401).json({ error: "User is not authorized to delete another user's story" });
      } else {
        const deleteResponse = await StoriesDAO.deleteStory(storyID, persistedUser);
        res.json({ success: true, deleteResponse });
      }
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ success: false, error: e.message });
    }
  }
}