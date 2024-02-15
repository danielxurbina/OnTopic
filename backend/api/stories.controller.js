import StoriesDAO from '../dao/storiesDAO.js';

export default class StoriesController {
    static async apiGetStories(req, res, next){
        const storiesPerPage = req.query.storiesPerPage ? parseInt(req.query.storiesPerPage) : 20
        const page = req.query.page ? parseInt(req.query.page) : 0
        let filters = {}
        if(req.query.title){
            filters.title = req.query.title
        } else if(req.query.url){
            filters.url = req.query.url
        }

        const { storiesList, totalNumStories } = await StoriesDAO.getStories({
            filters, page, storiesPerPage
        })

        let response = {
            stories: storiesList,
            page: page,
            filters: filters,
            entries_per_page: storiesPerPage,
            total_results: totalNumStories
        }
        res.json(response)
    }
}