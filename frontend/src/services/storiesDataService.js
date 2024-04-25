/*
  Name: Daniel Urbina
  Date: 4/25/2024
  Course name and section: IT302-002
  Assignment Name: Phase 5
  Email: du35@njit.edu
*/

import axios from 'axios';

const token = localStorage.getItem('token');

class StoriesDataService {
    getAllStories(page = 0, storiesPerPage = 20) {
        return axios.get(
            `${process.env.REACT_APP_BACKEND_STORIES_URL}?page=${page}&storiesPerPage=${storiesPerPage}`
        );
    }

    getStory(id) {
        return axios.get(
            `${process.env.REACT_APP_BACKEND_STORIES_URL}/id/${id}`
        );
    }

    findStory(query, by = "title", page = 0) {
        return axios.get(
            `${process.env.REACT_APP_BACKEND_STORIES_URL}?${by}=${query}&page=${page}`
        );
    }

    createStory(data) {
        return axios.post(
            `${process.env.REACT_APP_BACKEND_STORIES_URL}`,
            data,
            { headers: { "Authorization": `Bearer ${token}` } }
        );
    }

    updateStory(data) {
        return axios.put(
            `${process.env.REACT_APP_BACKEND_STORIES_URL}`,
            data,
            { headers: { "Authorization": `Bearer ${token}` } }
        );
    }

    deleteStory(data) {
        // for some reason the headers used in previous methods does not work for delete but this works
        // Source: I got the solution from https://stackoverflow.com/questions/51069552/axios-delete-request-with-request-body-and-headers
        return axios.delete(`${process.env.REACT_APP_BACKEND_STORIES_URL}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: data
        });
    }

    getAllComments(page = 0) {
        return axios.get(
            `${process.env.REACT_APP_BACKEND_COMMENTS_URL}?page=${page}`
        );
    }

    getComment(id) {
        return axios.get(
            `${process.env.REACT_APP_BACKEND_COMMENTS_URL}/id/${id}`
        );
    }

    findComment(query, by = "text", page = 0) {
        return axios.get(
            `${process.env.REACT_APP_BACKEND_COMMENTS_URL}?${by}=${query}&page=${page}`
        );
    }

    createComment(data) {
        return axios.post(
            `${process.env.REACT_APP_BACKEND_COMMENTS_URL}`,
            data,
            { headers: { "Authorization": `Bearer ${token}` } }
        );
    }

    updateComment(data) {
        return axios.put(
            `${process.env.REACT_APP_BACKEND_COMMENTS_URL}`,
            data,
            { headers: { "Authorization": `Bearer ${token}` } }
        );
    }

    // soft delete a comment
    deleteComment(data) {
        return axios.put(
            `${process.env.REACT_APP_BACKEND_COMMENTS_URL}/soft-delete`,
            data,
            { headers: { "Authorization": `Bearer ${token}` } }
        );
    }

    getAllUsers(page = 0) {
        return axios.get(
            `${process.env.REACT_APP_BACKEND_USERS_URL}?page=${page}`
        );
    }

    getUser(id) {
        return axios.get(
            `${process.env.REACT_APP_BACKEND_USERS_URL}/id/${id}`
        );
    }

    findUser(query, by = "username", page = 0) {
        return axios.get(
            `${process.env.REACT_APP_BACKEND_USERS_URL}?${by}=${query}&page=${page}`
        );
    }

    createUser(data) {
        return axios.post(
            `${process.env.REACT_APP_BACKEND_USERS_URL}`,
            data
        );
    }

    updateUser(data) {
        return axios.put(
            `${process.env.REACT_APP_BACKEND_USERS_URL}`,
            data,
            { headers: { "Authorization": `Bearer ${token}` } }
        );
    }

    deleteUser(id) {
        return axios.delete(
            `${process.env.REACT_APP_BACKEND_USERS_URL}`,
            { data: { user_id: id } },
            { headers: { "Authorization": `Bearer ${token}` } }
        );
    }

    login(data) {
        return axios.post(
            `${process.env.REACT_APP_BACKEND_USERS_URL}/login`,
            data
        );
    }
}

export default new StoriesDataService();