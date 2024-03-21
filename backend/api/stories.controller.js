/*
  Name: Daniel Urbina
  Date: 3/22/2024
  Course name and section: IT302-002
  Assignment Name: Phase 3
  Email: du35@njit.edu
*/

import StoriesDAO from "../dao/storiesDAO.js";
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
      if (!story) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(story);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e.message });
    }
  }

  // Method to create a story
  static async apiPostStory(req, res, next) {
    try {
      const postFields = {};
      postFields.by = req.body.by;
      postFields.descendants = 0;
      postFields.score = req.body.score;
      postFields.text = req.body.text;
      postFields.time = new Date();
      postFields.title = req.body.title;
      postFields.type = "story";
      postFields.url = req.body.url;
      req.body.image = req.body.image;
      postFields.lastUpdated = new Date();
      postFields.kids = [];

      const storyResponse = await StoriesDAO.addStory(postFields);
      res.json({ storyResponse });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  // Method to update a story
  static async apiUpdateStory(req, res, next) {
    try {
      let query = { _id: new ObjectId(req.body.story_id) };
      let updateFields = {};
      req.body.by && req.body.by != null ? (updateFields.by = req.body.by) : null;
      req.body.descendants && req.body.descendants != null ? (updateFields.descendants = req.body.descendants) : null;
      req.body.score && req.body.score != null ? (updateFields.score = req.body.score) : null;
      req.body.text && req.body.text != null ? (updateFields.text = req.body.text) : null;
      req.body.title && req.body.title != null ? (updateFields.title = req.body.title) : null;
      req.body.url && req.body.url != null ? (updateFields.url = req.body.url) : null;
      req.body.image && req.body.image != null ? (updateFields.image = req.body.image) : null;
      updateFields.lastUpdated = new Date();

      const updateResponse = await StoriesDAO.updateStory(query, updateFields);
      res.json({ updateResponse });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  // Method to delete a story
  static async apiDeleteStory(req, res, next) {
    try {
      const storyID = req.body.story_id;
      const deleteResponse = await StoriesDAO.deleteStory(storyID);
      res.json({ deleteResponse });
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e.message });
    }
  }
}