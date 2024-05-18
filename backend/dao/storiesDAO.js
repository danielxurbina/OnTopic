import CommentsDAO from "../dao/commentsDAO.js";
import UsersDAO from "./usersDAO.js";
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
        .sort({ time: -1 })
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
      console.log('Inside getStoryByID - Story ID: ', id)
      const response = await stories.findOne({ _id: new ObjectId(id) })
      return response;
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
  static async deleteStory(storyID, persistedUser) {
    try {
      const story = await stories.findOne({ _id: new ObjectId(storyID) })
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
        await UsersDAO.deleteComments(commentIDsToBeDeleted, persistedUser)
      } else {
        console.log("No comments to delete")
      }

      await stories.deleteOne({ _id: new ObjectId(storyID) });
      await UsersDAO.deleteStory(story, persistedUser)
      return { success: true };
    } catch (e) {
      console.error(`Unable to delete story: ${e}`);
      return { error: e };
    }
  }

  static async updateStoryDeletedCount(commentID) {
    try {
      const comment = await CommentsDAO.getCommentByID(commentID);
      // if the parentID is a comment then we need to go up the parent chain recursively to reach the story to update the deletedCount field
      // else if the parentID is a story then we need to update the deletedCount field
      const parentID = comment.parent;
      const commentResponse = await CommentsDAO.getCommentByID(parentID);
      const storyResponse = await this.getStoryByID(parentID);
      if (commentResponse) {
        // the parentID is a comment so we need to extract the parent ID and call the function recursively
        await this.updateStoryDeletedCount(parentID);
      } else if (storyResponse) {
        // the parentID is a story so we need to update the deletedCount field
        const query = { _id: new ObjectId(parentID) }
        const update = { $inc: { deletedCount: 1 } }
        const updateResponse = await stories.updateOne(query, update)
        return updateResponse
      }
    } catch (e) {
      console.error(`Unable to update story deleted count: ${e}`);
      return { error: e };
    }
  }
}