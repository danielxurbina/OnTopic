/* 
	Name: Daniel Urbina
	Date: 2/21/2024
	Course name and section: IT302-002
	Assignment Name: Phase 2
	Email: du35@njit.edu
*/

import app from './server.js'
import mongodb from "mongodb"
import dotenv from "dotenv"
import StoriesDAO from "./dao/storiesDAO.js"

async function main() 
{
	dotenv.config()
	const client = new mongodb.MongoClient(process.env.STORIES_DB_URI)
	const port = process.env.PORT || 8000
	try {
		await client.connect
		await StoriesDAO.injectDB(client)
		app.listen(port, () => {
			console.log('server is running on port:' + port);
		})
	} catch (e) {
		console.error(e)
		process.exit(1)
	}
}
main().catch(console.error);
