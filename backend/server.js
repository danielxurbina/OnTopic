/* 
	Name: Daniel Urbina
	Date: 2/21/2024
	Course name and section: IT302-002
	Assignment Name: Phase 2
	Email: du35@njit.edu
*/

import express from 'express'
import cors from 'cors'
import stories from './api/stories.route.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use("/api/v1/du35/stories", stories)
app.use('*', (req, res) => {
	res.status(404).json({error: "not found"})
})

export default app