/* 
	Name: Daniel Urbina
	Date: 2/21/2024
	Course name and section: IT302-002
	Assignment Name: Phase 2
	Email: du35@njit.edu
*/

import express from 'express'
import StoriesController from './stories.controller.js'

const router = express.Router()
router.route('/').get(StoriesController.apiGetStories)

export default router