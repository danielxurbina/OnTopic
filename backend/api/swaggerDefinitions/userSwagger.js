/**
 * @swagger
 * /api/v1/du35/stories/users:
 *   get:
 *     summary: Retrieve a list of users.
 *     description: Retrieve a list of users from the users MongoDB collection.
 *     tags: [users]
 *     parameters: 
 *       - name: username
 *         in: query
 *         description: Filter users by username
 *         required: false
 *         schema:
 *           type: string
 *           format: string
 *       - name: role
 *         in: query
 *         description: Filter users by role
 *         required: false
 *         schema:
 *           type: string
 *           format: string
 *           example: admin
 *       - name: usersPerPage
 *         in: query
 *         description: Number of users to return per page
 *         required: false
 *         schema:
 *           type: integer
 *           maximum: 20
 *           format: int32
 *       - name: page
 *         in: query
 *         description: Page number to return for pagination
 *         required: false
 *         schema:
 *           type: integer
 *           maximum: 9999
 *           format: int32
 *     responses:
 *       200:
 *         description: A list of users
 */

/**
 * @swagger
 * /api/v1/du35/stories/users:
 *   post:
 *     summary: Create a new user.
 *     description: Create a new user in the users MongoDB collection.
 *     tags: [users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "du35"
 *               password: 
 *                 type: string
 *                 example: "password"
 *               role:
 *                 type: string
 *                 example: "user"
 *     responses:
 *       200:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 acknowledged:
 *                   type: boolean
 *                   description: Acknowledgement that POST was successful.
 *                   example: true
 *                 insertedId:
 *                   type: integer
 *                   description: The new user's ID
 *                   example: 65efffc3935a10b8fea62345
 */

/**
 * @swagger
 * /api/v1/du35/stories/users:
 *   put:
 *     summary: Update a user.
 *     description: Update a user in the users MongoDB collection, for fields that are not being updated, insert null to exclude them from the update.
 *     tags: [users]
 */

/**
 * @swagger
 * /api/v1/du35/stories/users/:
 *   delete:
 *     summary: Delete a user.
 *     description: Delete a user
 *     tags: [users]
 */

/**
 * @swagger
 * /api/v1/du35/stories/users/id/{user_id}:
 *   get:
 *     summary: Retrieve a user by ID.
 *     description: Retrieve a user from the users MongoDB collection by its ID.
 *     tags: [users]
 *     parameters:
 *       - name: user_id
 *         in: path
 *         description: The ID of the user to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A user object
 *       404:
 *         description: The user was not found
 *     
 * 
 */