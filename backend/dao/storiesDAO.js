let stories

export default class StoriesDAO {
    static async injectDB(conn){
        if(stories){
            return
        } try {
            stories = await conn.db(process.env.STORIES_NS).collection("stories_du35")
        } catch (e){
            console.error(`Unable to connect in StoriesDAO: ${e}`)
        }
    }

    static async getStories({
        filters = null, 
        page = 0, 
        storiesPerPage = 20
    } = {}) {
            let query
            if(filters){
                if("title" in filters){
                    query = { $text: { $search: filters['title']}}
                } else if("url" in filters){
                    query = {"url": {$eq: filters['url']}}
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
            catch (e){
                console.error(`Unable to issue find command, ${e}`)
                console.error(e)
                return { storiesList: [], totalNumStories: 0 }
            }
    }
}