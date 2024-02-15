import express from 'express'
import StoriesController from './stories.controller.js'

const router = express.Router()
router.route('/').get(StoriesController.apiGetStories)

export default router
