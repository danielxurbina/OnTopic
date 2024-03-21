/*
  Name: Daniel Urbina
  Date: 3/22/2024
  Course name and section: IT302-002
  Assignment Name: Phase 3
  Email: du35@njit.edu
*/

import CommentsDAO from "../dao/commentsDAO.js";
import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let stories;
export default class StoriesDAO {
  static async injectDB(conn) {
    if (stories) {
      return;
    }
    try {
      stories = await conn
        .db(process.env.STORIES_NS)
        .collection("stories_du35");
    } catch (e) {
      console.error(`Unable to connect in StoriesDAO: ${e}`);
    }
  }

  // This function retrieves stories
  static async getStories({ filters = null, page = 0, storiesPerPage = 20, } = {}) {
    let query;

    if (filters) {
      if ("by" in filters) {
        query = { by: { $eq: filters.by } };
      } else if ("descendants" in filters) {
        query = { descendants: { $eq: parseInt(filters.descendants) } };
      } else if ("score" in filters) {
        query = { score: { $eq: parseInt(filters.score) } };
      } else if ("title" in filters) {
        query = { $text: { $search: filters.title } };
      } else if ("text" in filters) {
        query = { $text: { $search: filters.text } };
      } else if ("kids" in filters) {
        const kidsFilter = filters.kids === "true"
        if (kidsFilter) {
          query = { kids: { $exists: true, $ne: [] } };
        } else {
          query = { kids: { $exists: true, $eq: [] } };
        }
      }
    }
    let cursor;
    try {
      cursor = await stories
        .find(query)
        .limit(storiesPerPage)
        .skip(storiesPerPage * page);
      const storiesList = await cursor.toArray();
      const totalNumStories = await stories.countDocuments(query);
      return { storiesList, totalNumStories };
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      console.error(e);
      return { storiesList: [], totalNumStories: 0 };
    }
  }

  // This function retrieves a story by its ID
  static async getStoryByID(id) {
    try {
      return await stories.findOne({ _id: new ObjectId(id) })
    } catch (e) {
      console.error(`Unable to retrieve story: ${e}`);
      return { error: e };
    }
  }

  // This function adds a story
  static async addStory(query) {
    try {
      return await stories.insertOne(query);
    } catch (e) {
      console.error(`Unable to post story: ${e}`);
      return { error: e };
    }
  }

  // This function updates a story
  static async updateStory(query, updateFields) {
    try {
      const updateResponse = await stories.updateOne(query, {
        $set: updateFields,
      });
      return updateResponse;
    } catch (e) {
      console.error(`Unable to update story: ${e}`);
      return { error: e };
    }
  }

  // this function updates a story that has recently been added a comment
  static async updateStoryWithComment(storyID, childCommentID) {
    try {
      /*
        Each story has a descendant (which are comments count)
        Each story has a kids array (array of comment ids)
        If you add a comment to a story
            - We increment the descendants count
            - We add the comment id to the kids array
      */
      const query = { _id: new ObjectId(storyID) };
      const update = {
        $inc: { descendants: 1 },
        $push: { kids: childCommentID },
      };
      const storyResponse = await stories.updateOne(query, update);
      return storyResponse;
    } catch (e) {
      console.error(`Unable to update story with comment: ${e}`);
      return { error: e };
    }
  }

  // this function updates the descendants count of a story that has recently been added a comment
  static async updateStoryDescendants(parentID) {
    try {
      const commentResponse = await CommentsDAO.getCommentByID(parentID);
      // if the parentID is a comment then we need to go up the parent chain recursively to reach the story to update the descendants count
      if (commentResponse) {
        await this.updateStoryDescendants(commentResponse.parent);
      } else {
        const query = { _id: new ObjectId(parentID) };
        const update = { $inc: { descendants: 1 } };
        await stories.updateOne(query, update);
      }
    } catch (e) {
      console.error(`Unable to update story descendants: ${e}`);
      return { error: e };
    }
  }

  // This function collects all comment IDs associated with a story
  static async collectCommentIDs(commentID, commentIDs = []) {
    const comment = await CommentsDAO.getCommentByID(commentID);
    // If the comment has kids (nested comments), recursively collect the comment IDs
    if (comment.kids.length > 0) {
      for (const kid of comment.kids) {
        await this.collectCommentIDs(kid, commentIDs);
      }
    }
    commentIDs.push(commentID);
    return commentIDs;
  }

  // This function deletes a story
  static async deleteStory(storyID) {
    try {
      const story = await this.getStoryByID(storyID);
      let commentIDsToBeDeleted = [];

      // Collect all comment IDs associated with the story
      for (let commentID of story.kids) {
        const ids = await this.collectCommentIDs(commentID);
        commentIDsToBeDeleted = [...commentIDsToBeDeleted, ...ids];
      }

      // If there are comments to be deleted, sort them and delete them
      if (commentIDsToBeDeleted.length > 0) {
        commentIDsToBeDeleted.sort()
        var query = { _id: { $in: commentIDsToBeDeleted } };
        await CommentsDAO.deleteManyComments(query)
      } else {
        console.log("No comments to delete")
      }

      await stories.deleteOne({ _id: new ObjectId(storyID) });
      return { success: true };
    } catch (e) {
      console.error(`Unable to delete story: ${e}`);
      return { error: e };
    }
  }
}