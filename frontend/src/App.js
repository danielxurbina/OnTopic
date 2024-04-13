/*
  Name: Daniel Urbina
  Date: 4/12/2024
  Course name and section: IT302-002
  Assignment Name: Phase 4
  Email: du35@njit.edu
*/

import './App.css';
import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import StoriesList from './components/StoriesList';
import Story from './components/Story';
import Login from './components/Login';
import SignUp from './components/SignUp';
import AddStory from './components/AddStory';
import storiesDataService from './services/storiesDataService';

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    // Set the current user to the user in local storage if the currentUser is logged in to keep hold of state on page refresh
    const isLoggedIn = window.localStorage.getItem('isLoggedIn');
    const userID = window.localStorage.getItem('currentUserID');
    if (isLoggedIn === 'true') {
      if (userID) {
        console.log('Getting user...')
        getUser(userID);
      }
    }
    // If the user is not logged in, set the currentUser to null 
    else {
      return null;
    }
  });
  const navigate = useNavigate();
  const isLoggedIn = window.localStorage.getItem('isLoggedIn');

  async function login(user = null) {
    window.localStorage.setItem('isLoggedIn', true);
    window.localStorage.setItem('currentUserID', user.id);
    setCurrentUser(user);
  }

  async function logout() {
    setCurrentUser(null);
    if (isLoggedIn === 'true') {
      console.log('Logging out...')
      window.localStorage.removeItem('currentUserID');
      window.localStorage.removeItem('isLoggedIn');
      window.localStorage.removeItem('token');
    }
    navigate('/');
  }

  async function getUser(id) {
    storiesDataService.getUser(id)
      .then(response => {
        setCurrentUser({
          id: response.data._id,
          username: response.data.username,
          role: response.data.role
        });
      })
      .catch(error => {
        console.log(`error: ${error}`);
      });
  }

  return (
    <div className="App">
      <NavigationBar currentUser={currentUser} logout={logout} />
      <Routes>
        <Route path="/du35_login" element={<Login login={login} />}></Route>
        <Route path="/du35_signup" element={<SignUp login={login} />}></Route>
        <Route path="/" element={<StoriesList />}></Route>
        <Route path="/du35_stories" element={<StoriesList />}></Route>
        <Route path="/du35_submit" element={<AddStory currentUser={currentUser} />}></Route>
        <Route path="/du35_stories/:storyID" element={currentUser ? <Story currentUser={currentUser} /> : <Story />}></Route>
      </Routes>
    </div>
  );
}

export default App;