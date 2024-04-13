/*
  Name: Daniel Urbina
  Date: 4/12/2024
  Course name and section: IT302-002
  Assignment Name: Phase 4
  Email: du35@njit.edu
*/

import jwt from "jsonwebtoken";
import UsersDAO from "../dao/usersDAO.js";

async function authenticate(req, res, next) {
    console.log('Authenticating...')
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        // verify the token
        try {
            const decoded = jwt.verify(token, 'SECRETKEY');
            if (decoded) {
                const username = decoded.username;
                const persistedUser = await UsersDAO.getUserByUsername(username);
                console.log(`Persisted User: ${persistedUser}`)
                if (persistedUser) {
                    req.user = { _id: persistedUser._id, username: persistedUser.username, role: persistedUser.role }
                    next();
                } else {
                    // User does not exist
                    res.status(401).json({ success: false, error: "User does not exist" });
                }
            } else {
                // Decoding fails
                res.status(401).json({ success: false, error: "No authorization headers found." })
            }
        } catch (e) {
            // Token verification fails
            res.status(401).json({ success: false, error: 'Token has been tampered' })
        }
    } else {
        // No authentication headers found
        res.status(401).json({ success: false, error: "No authentication headers found." })
    }
}

export default authenticate;