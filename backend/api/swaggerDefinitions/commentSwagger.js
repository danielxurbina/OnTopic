/**
 * @swagger
 * /api/v1/du35/stories/comments:
 *   get:
 *     summary: Retrieve a list of comments.
 *     description: Retrieve a list of comments from the comments MongoDB collection.
 *     tags: [comments]
 *     parameters: 
 *       - name: by
 *         in: query
 *         description: Filter comments by author
 *         required: false
 *         schema:
 *           type: string
 *           format: string
 *       - name: parent
 *         in: query
 *         description: Filter comments by parent id (the id can be either a story or a comment since comments can have child comments and stories can have comments)
 *         required: false
 *         schema:
 *           type: ObjectId
 *           format: string
 *           example: 65efffc3935a10b8fea62345
 *       - name: text
 *         in: query
 *         description: Filter comments by text
 *         required: false
 *         schema:
 *           type: string
 *           format: string
 *       - name: commentsPerPage
 *         in: query
 *         description: Number of comments to return per page
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
 *         description: A list of comments
 */

/**
 * @swagger
 * /api/v1/du35/stories/comments:
 *   post:
 *     summary: Create a new comment.
 *     description: Create a new comment in the comments MongoDB collection.
 *     tags: [comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               by:
 *                 type: string
 *                 example: "du35"
 *               user_id: 
 *                 type: integer
 *                 example: 3
 *               parent:
 *                 type: ObjectId
 *                 example: 65efffc3935a10b8fea62345
 *               text:
 *                 type: string
 *                 example: "Comment Text"
 *     responses:
 *       200:
 *         description: The comment was successfully created
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
 *                   description: The new comment's ID
 *                   example: 65efffc3935a10b8fea62345
 */

/**
 * @swagger
 * /api/v1/du35/stories/comments:
 *   put:
 *     summary: Update a comment.
 *     description: Update a comment in the comments MongoDB collection, for fields that are not being updated, insert null to exclude them from the update. Optional values include (score, text, title, url, image).
 *     tags: [comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment_id:
 *                 type: ObjectId
 *                 example: 65efffc3935a10b8fea62345
 *               user_id:
 *                 type: integer
 *                 example: 3
 *               text:
 *                 type: string
 *                 example: "Comment Text"
 *     responses:
 *       200:
 *         description: The comment was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 acknowledged:
 *                   type: boolean
 *                   description: Acknowledgement that PUT was successful.
 *                   example: true
 *                 modifiedCount:
 *                   type: integer
 *                   description: The number of stories modified
 *                   example: 1
 *       404:
 *         description: The comment was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message
 *                   example: "Comment not found"
 */

/**
 * @swagger
 * /api/v1/du35/stories/comments/id/{comment_id}:
 *   get:
 *     summary: Retrieve a comment by ID.
 *     description: Retrieve a comment from the comments MongoDB collection by its ID.
 *     tags: [comments]
 *     parameters:
 *       - name: comment_id
 *         in: path
 *         description: The ID of the comment to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A comment object
 *       404:
 *         description: The comment was not found
 *     
 * 
 */

/**
 * @swagger
 * /api/v1/du35/stories/comments/soft-delete:
 *   put:
 *     summary: Soft delete a comment.
 *     description: Delete a comment by adding a deleted field to the comment document in the comments MongoDB collection.
 *     tags: [comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment_id:
 *                 type: ObjectId
 *                 example: 65efffc3935a10b8fea62345
 *               user_id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: The comment was succesfully soft deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 acknowledged:
 *                   type: boolean
 *                   description: Acknowledgement that PUT was successful.
 *                   example: true
 *                 modifiedCount:
 *                   type: integer
 *                   description: The number of comments modified
 *                   example: 1
 *       404:
 *         description: The comment was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message
 *                   example: "Comment not found"
 */