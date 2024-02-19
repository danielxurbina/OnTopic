/* 
	Name: Daniel Urbina
	Date: 2/21/2024
	Course name and section: IT302-002
	Assignment Name: Phase 2
	Email: du35@njit.edu
*/

import StoriesDAO from '../dao/storiesDAO.js';

export default class StoriesController 
{
    static async apiGetStories(req, res, next)
    {
        const storiesPerPage = req.query.storiesPerPage ? parseInt(req.query.storiesPerPage) : 20
        const page = req.query.page ? parseInt(req.query.page) : 0
        let filters = {}
        const filterKeys = [
            'by', 
            'descendants', 
            'score', 
            'title',
            'text',
            'type', 
        ];

        filterKeys.forEach(key => {
            if (req.query[key]) {
                filters[key] = req.query[key];
            }
        });

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