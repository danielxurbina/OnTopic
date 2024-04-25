/*
  Name: Daniel Urbina
  Date: 4/25/2024
  Course name and section: IT302-002
  Assignment Name: Phase 5
  Email: du35@njit.edu
*/

import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId
import bcrypt from "bcrypt"

let users;
export default class UsersDAO {
    static async injectDB(conn) {
        if (users) {
            return;
        }
        try {
            users = await conn.db(process.env.STORIES_NS).collection("users_du35");
        } catch (e) {
            console.error(`Unable to establish connection handle in usersDAO: ${e}`);
        }
    }

    static async getUsers({ filters = null, page = 0, usersPerPage = 20 } = {}) {
        let query;
        if (filters) {
            if ("username" in filters) {
                query = { username: { $eq: filters.username } }
            } else if ("role" in filters) {
                query = { role: { $eq: filters.role } }
            }
        }
        let cursor;
        try {
            cursor = await users
                .find(query)
                .limit(usersPerPage)
                .skip(usersPerPage * page);
            const usersList = await cursor.toArray();
            const totalNumUsers = await users.countDocuments(query);
            return { usersList, totalNumUsers }
        } catch (e) {
            console.error(`Unable to retrieve users: ${e}`);
            return { error: e }
        }
    }

    static async getUserByID(id) {
        try {
            return await users.findOne({ _id: new ObjectId(id) })
        } catch (e) {
            console.error(`unable to retrieve user: ${e}`);
            return { error: e };
        }
    }

    static async getUserByUsername(username) {
        try {
            return await users.findOne({ username: username })
        } catch (e) {
            console.error(`unable to retrieve user: ${e}`);
            return { error: e };
        }
    }

    static async addUser(query) {
        try {
            const userExist = await users.findOne({ username: query.username })
            if (userExist) {
                return { error: "User already exists" }
            } else {
                // check if the username is an empty string
                if (query.username === "" || query.password === "") {
                    return { error: "Username or password is empty" }
                } else {
                    return await users.insertOne(query)
                }
            }
        } catch (e) {
            console.error(`Unable to add user: ${e}`);
            return { error: e };
        }
    }

    static async updateUser(query, updateFields = null, story = null, comment = null) {
        try {
            let update;
            let push = {};

            if (story && comment) {
                push = { stories: new ObjectId(story), comments: new ObjectId(comment) }
            } else if (story) {
                push = { stories: new ObjectId(story) }
            } else if (comment) {
                push = { comments: new ObjectId(comment) }
            }

            updateFields != null && push.length != 0 ? update = { $set: updateFields, $push: push } : update = { $push: push }

            return await users.updateOne(query, update)
        } catch (e) {
            console.error(`Unable to update user: ${e}`);
            return { error: e };
        }
    }

    static async deleteUser(id) {
        try {
            console.log(id)
        } catch (e) {
            console.error(`Unable to delete user: ${e}`);
            return { error: e };
        }
    }

    static async loginUser(username, password) {
        try {
            // Find the user by username
            const user = await users.findOne({ username: username })
            const exclude = ['password', 'stories', 'comments', 'createdAt', 'lastModified']
            // If the user exists check if the password is correct
            if (user) {
                // Compare the provided password with the hashed password stored in the database
                const isValid = await bcrypt.compare(password, user.password);
                if (isValid) {
                    // Password is correct
                    // When returning the user exclude the password field, stories, comments, createdAt, and lastModified fields
                    exclude.forEach(field => user[field] = undefined)
                    return user;
                } else {
                    // Password is incorrect
                    return { error: "Password is incorrect" };
                }
            } else {
                // User does not exist
                return { error: "User doesn't exist" };
            }
        } catch (e) {
            console.error(`Unable to login user: ${e}`);
            return { error: e };
        }
    }

    static async deleteComments(storyCommentIDs) {
        try {
            const usersToUpdate = await users.find().toArray()
            const listOfMatchingComments = []
            usersToUpdate.forEach(user => {
                const matchingComments = user.comments.filter(userCommentID =>
                    storyCommentIDs.some(storyCommentID =>
                        storyCommentID.equals(new ObjectId(userCommentID))
                    )
                )
                if (matchingComments.length > 0) {
                    listOfMatchingComments.push({ user: user.username, comments: matchingComments })
                }
            })

            listOfMatchingComments.forEach(async user => {
                const updateQuery = { username: user.user }
                const update = { $pull: { comments: { $in: user.comments } } }
                await users.updateOne(updateQuery, update)
            })
        } catch (e) {
            console.log(`Unable to delete comments: ${e}`)
            return { error: e }
        }
    }

    static async deleteStory(story) {
        try {
            const userID = new ObjectId(story.user_id)
            const storyID = new ObjectId(story._id)
            const updateQuery = { _id: userID }
            const update = { $pull: { stories: storyID } }
            await users.updateOne(updateQuery, update)
        } catch (e) {
            console.error(`Unable to delete story: ${e}`);
            return { error: e };
        }
    }
}