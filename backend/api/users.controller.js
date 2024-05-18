import UsersDAO from "../dao/usersDAO.js"
import CommentsDAO from "../dao/commentsDAO.js"
import StoriesDAO from "../dao/storiesDAO.js"
import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default class UsersController {
    static async apiGetUsers(req, res, next) {
        try {
            const usersPerPage = req.query.usersPerPage ? parseInt(req.query.usersPerPage) : 20
            const page = req.query.page ? parseInt(req.query.page) : 0
            let filters = {}

            if (req.query.username) {
                filters.username = req.query.username
            } else if (req.query.role) {
                filters.role = req.query.role
            }

            const { usersList, totalNumUsers } = await UsersDAO.getUsers({
                filters,
                page,
                usersPerPage
            })

            let response = {
                users: usersList,
                page: page,
                filters: filters,
                entries_per_page: usersPerPage,
                total_results: totalNumUsers
            }
            res.json(response);
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiGetUserByID(req, res, next) {
        try {
            const id = req.params.id || {}
            const user = await UsersDAO.getUserByID(id);
            if (!user) {
                res.status(404).json({ error: "Not found" });
                return;
            }
            res.json(user);
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e.message })
        }
    }

    static async apiPostUser(req, res, next) {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const postFields = {
                username: req.body.username,
                password: hashedPassword,
                role: req.body.role,
                createdAt: new Date(),
                lastModified: new Date(),
                comments: [],
                stories: []
            };
            const userResponse = await UsersDAO.addUser(postFields);
            if(userResponse.error){
                res.json({ success: false, error: userResponse.error })
            } else {
                const token = jwt.sign({ username: postFields.username }, 'SECRETKEY')
                const user = await UsersDAO.getUserByID(userResponse.insertedId)
                const exclude = ['password', 'stories', 'comments', 'createdAt', 'lastModified']
                exclude.forEach(field => user[field] = undefined)
                res.json({ success: true, token: token, user: user })
            }
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiUpdateUser(req, res, next) {
        /* 
            If I update a User, I will need to check if I'm updating the users username
            If I am, I will need to update the username in the stories and comments collections
            If I'm not updating the username, I will just update the user
        */
        try {
            let query = { _id: new ObjectId(req.body.user_id) }
            let updateFields = { lastModified: new Date() };
            let story; // holds the optional story_id
            let comment; // holds the optional comment_id
            const user = await UsersDAO.getUserByID(req.body.user_id);
            const persistedUser = req.user;
            if(persistedUser._id.equals(user._id) || persistedUser.role === "admin"){
                // If username is provided, update the username
                if (req.body.username) {
                    updateFields.username = req.body.username;
                    console.log('User: ', user.username)
                    // Update username in stories and comments
                    await Promise.all([
                        StoriesDAO.updateStory({ by: user.username }, { by: req.body.username }),
                        CommentsDAO.updateComment({ by: user.username }, { by: req.body.username })
                    ])
                }
    
                // If password is provided, hash the password and update the user's password
                if (req.body.password) {
                    const hashedPassword = await bcrypt.hash(req.body.password, 10);
                    updateFields.password = hashedPassword;
                }
    
                // If the story_id is provided, check if the story exists and if the story belongs to the user
                if (req.body.story_id) {
                    const storyExist = await StoriesDAO.getStoryByID(req.body.story_id);
                    if (storyExist) {
                        storyExist.by === user.username ? story = req.body.story_id : story = null;
                    } else {
                        story = null;
                    }
                }
    
                // If the comment_id is provided, check if the comment exists and if the comment belongs to the user
                if (req.body.comment_id) {
                    const commentExist = await CommentsDAO.getCommentByID(req.body.comment_id);
                    if (commentExist) {
                        commentExist.by === user.username ? comment = req.body.comment_id : comment = null;
                    } else {
                        comment = null;
                    }
                }
    
                const userResponse = await UsersDAO.updateUser(query, updateFields, story, comment);
                res.json({ userResponse });
            } else {
                res.status(401).json({ success: false, error: "Unauthorized to update user" });
            }
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiDeleteUser(req, res, next) {
        /* 
            If I delete a User, I will need to delete the user's stories and the comments that are inside the users created story
            For comments, if I am deleting a user, I will soft delete the comment by updating the comment's deleted field to true
        */
        try {
            console.log(req.body)
            const user_id = req.body.user_id;
            const user = await UsersDAO.getUserByID(user_id);
            if(!user){
                res.status(404).json({ success: false, error: "User not found" });
            }
            const persistedUser = req.user;
            if(persistedUser._id.equals(user._id) || persistedUser.role === "admin"){
                // delete the user
                // TODO add functionality to delete the user's stories and comments
            } else {
                res.status(401).json({ success: false, error: "Unauthorized to delete user" });
            }
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiLoginUser(req, res, next) {
        try {
            const user = await UsersDAO.loginUser(req.body.username, req.body.password);
            if (user.error) {
                res.json({ sucesss: false, error: 'Not authenticated' })
            } else {
                const token = jwt.sign({ username: user.username }, 'SECRETKEY')
                res.json({ success: true, token: token, user: user })
            }
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
}