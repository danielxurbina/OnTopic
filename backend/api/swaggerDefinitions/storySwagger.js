/**
 * @swagger
 * /api/v1/du35/stories:
 *   get:
 *     summary: Retrieve a list of stories.
 *     description: Retrieve a list of stories from the du35_stories MongoDB collection.
 *     tags: [stories]
 *     parameters: 
 *       - name: by
 *         in: query
 *         description: Filter stories by author
 *         required: false
 *         schema:
 *           type: string
 *           format: string
 *       - name: descendants
 *         in: query
 *         description: Filter stories by number of descendants (comment count)
 *         required: false
 *         schema:
 *           type: integer
 *           format: int32
 *       - name: score
 *         in: query
 *         description: Filter stories by score (stories score)
 *         required: false
 *         schema:
 *           type: integer
 *           format: int32
 *       - name: title
 *         in: query
 *         description: Filter stories by title
 *         required: false
 *         schema:
 *           type: string
 *           format: string
 *       - name: text
 *         in: query
 *         description: Filter stories by text
 *         required: false
 *         schema:
 *           type: string
 *           format: string
 *       - name: kids
 *         in: query
 *         description: Filter stories by kids (comments)
 *         required: false
 *         schema:
 *           type: boolean
 *           format: boolean
 *           example: true
 *       - name: storiesPerPage
 *         in: query
 *         description: Number of stories to return per page
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
 *         description: A list of stories
 */

/**
 * @swagger
 * /api/v1/du35/stories:
 *   post:
 *     summary: Create a new story.
 *     description: Create a new story in the du35_stories MongoDB collection.
 *     tags: [stories]
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
 *               score:
 *                 type: integer
 *                 example: 3
 *               text:
 *                 type: string
 *                 example: "Story Text"
 *               title:
 *                 type: string
 *                 example: "Story Title"
 *               url:
 *                 type: string
 *                 example: "http://www.example.com"
 *               image:
 *                 type: string
 *                 example: "http://www.example.com/image.jpg"
 *     responses:
 *       200:
 *         description: The story was successfully created
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
 *                   description: The new story's ID
 *                   example: 65efffc3935a10b8fea62345
 */

/**
 * @swagger
 * /api/v1/du35/stories:
 *   put:
 *     summary: Update a story.
 *     description: Update a story in the du35_stories MongoDB collection, for fields that are not being updated, insert null to exclude them from the update.
 *     tags: [stories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               story_id:
 *                 type: ObjectId
 *                 example: 65efffc3935a10b8fea62345
 *               by:
 *                 type: string
 *                 example: "du35"
 *               descendants:
 *                 type: integer
 *                 example: 3
 *               score:
 *                 type: integer
 *                 example: 3
 *               text:
 *                 type: string
 *                 example: "Story Text"
 *               title:
 *                 type: string
 *                 example: "Story Title"
 *               url:
 *                 type: string
 *                 example: "http://www.example.com"
 *               image:
 *                 type: string
 *                 example: "http://www.example.com/image.jpg"
 *     responses:
 *       200:
 *         description: The story was successfully updated
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
 *         description: The story was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message
 *                   example: "Story not found"
 */

/**
 * @swagger
 * /api/v1/du35/stories:
 *   delete:
 *     summary: Delete a story.
 *     description: Delete a story from the du35_stories MongoDB collection.
 *     tags: [stories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               story_id:
 *                 type: ObjectId
 *                 example: 65efffc3935a10b8fea62345
 *     responses:
 *       200:
 *         description: Deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                 acknowledged:
 *                   type: boolean
 *                   description: Acknowledgement that DELETE was successful.
 *                   example: true
 *                 deletedCount:
 *                   type: integer
 *                   description: The number of stories deleted.
 *                   example: 1
 */

/**
 * @swagger
 * /api/v1/du35/stories/id/{story_id}:
 *   get:
 *     summary: Retrieve a story by ID.
 *     description: Retrieve a story from the du35_stories MongoDB collection by its ID.
 *     tags: [stories]
 *     parameters:
 *       - name: story_id
 *         in: path
 *         description: The ID of the story to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A story object
 *       404:
 *         description: The story was not found
 */