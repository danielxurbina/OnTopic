import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let comments;
export default class CommentsDAO {
  static async injectDB(conn) {
    if (comments) {
      return;
    }
    try {
      comments = await conn.db(process.env.STORIES_NS).collection("comments_du35");
    } catch (e) {
      console.error(
        `Unable to establish connection handle in commentsDAO: ${e}`,
      );
    }
  }

  // This function retrieves comments
  static async getComments({ filters = null, page = 0, commentsPerPage = 20, } = {}) {
    let query;
    if (filters) {
      if ("by" in filters) {
        query = { by: { $eq: filters.by } };
      } else if ("parent" in filters) {
        query = { parent: { $eq: filters.parent } };
      } else if ("text" in filters) {
        query = { $text: { $search: filters.text } };
      }
    }
    let cursor;
    try {
      cursor = await comments
        .find(query)
        .limit(commentsPerPage)
        .skip(commentsPerPage * page);
      const commentsList = await cursor.toArray();
      const totalNumComments = await comments.countDocuments(query);
      return { commentsList, totalNumComments };
    } catch (e) {
      console.error(`Unable to retrieve comments: ${e}`);
      return { error: e };
    }
  }

  // This function retrieves a comment by its ID
  static async getCommentByID(id) {
    try {
      return await comments.findOne({ _id: new ObjectId(id) })
    } catch (e) {
      console.error(`unable to retrieve comment: ${e}`);
      return { error: e };
    }
  }

  // This function adds a comment
  static async addComment(query) {
    try {
      return await comments.insertOne(query);
    } catch (e) {
      console.error(`unable to post comment: ${e}`);
      console.error(e);
      return { error: e };
    }
  }

  // This function updates a comment
  static async updateComment(query, updateFields) {
    try {
      console.log('Inside updateComment: ', query, updateFields)
      return await comments.updateOne(query, { $set: updateFields, });
    } catch (e) {
      console.error(`unable to update comment: ${e}`);
      console.error(e);
      return { error: e };
    }
  }

  // This function updates a comment by adding a child comment
  static async updateCommentWithComment(commentID, childCommentID) {
    try {
      // This will find the document with the commentID and push the childCommentID to the kids array
      const query = { _id: new ObjectId(commentID) };
      const update = {
        $push: { kids: childCommentID }
      }
      return await comments.updateOne(query, update);
    } catch (e) {
      console.error(`unable to update comment with childCommentID: ${e}`);
      console.error(e);
      return { error: e };
    }
  }

  // This function is a helper function to the deleteStory() function in storiesDAO
  // this will only be called if a user wants to delete a story and all its comments
  // else if a user wants to delete a single comment, it will go through a soft delete to avoid deleting the whole comment chain
  static async deleteManyComments(query) {
    try {
      return await comments.deleteMany(query);
    } catch (e) {
      console.error(`unable to delete comments: ${e}`);
      console.error(e);
      return { error: e };
    }
  }
}