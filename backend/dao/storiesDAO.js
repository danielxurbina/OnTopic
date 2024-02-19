/* 
	Name: Daniel Urbina
	Date: 2/21/2024
	Course name and section: IT302-002
	Assignment Name: Phase 2
	Email: du35@njit.edu
*/

let stories

export default class StoriesDAO 
{
    static async injectDB(conn)
    {
        if(stories) {
            return
        } 
        try {
            stories = await conn.db(process.env.STORIES_NS).collection("stories_du35")
        } catch (e) {
            console.error(`Unable to connect in StoriesDAO: ${e}`)
        }
    }

    static async getStories({ filters = null, page = 0, storiesPerPage = 20 } = {}) 
    {
        let filterKeys = {
            by: "by",
            descendants: "descendants",
            score: "score",
            title: "title",
            text: "text",
            type: "type",
        }
        let query
        if(filters) {
            for(const key in filterKeys) {
                if(key in filters) {
                    if(key == "score") {
                        query = {[key]: {$eq: parseInt(filters[key])}}
                    }
                    else if(key == "descendants") {
                        query = {[key]: {$eq: parseInt(filters[key])}}
                    }
                    else {
                        query = { $text: { $search: filters[key] } }
                    }
                }
            }
        }
        let cursor
        try {
            cursor = await stories
                .find(query)
                .limit(storiesPerPage)
                .skip(storiesPerPage * page)
            const storiesList = await cursor.toArray()
            const totalNumStories = await stories.countDocuments(query)
            return { storiesList, totalNumStories }
        } 
        catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            console.error(e)
            return { storiesList: [], totalNumStories: 0 }
        }
    }
}