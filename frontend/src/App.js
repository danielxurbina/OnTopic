/*
  Name: Daniel Urbina
  Date: 4/25/2024
  Course name and section: IT302-002
  Assignment Name: Phase 5
  Email: du35@njit.edu
*/

import './App.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import NavigationBar from './components/NavigationBar';
import StoriesList from './components/StoriesList';
import Story from './components/Story';
import AddComment from './components/AddComment';
import Login from './components/Login';
import SignUp from './components/SignUp';
import AddStory from './components/AddStory';
import Profile from './components/Profile';
import storiesDataService from './services/storiesDataService';

function App() {
  const [currentUser, setCurrentUser] = useState()
  const [loggedOut, setLoggedOut] = useState(false);
  const isLoggedIn = window.localStorage.getItem('isLoggedIn');
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedOut) {
      const timeout = setTimeout(() => {
        setLoggedOut(false);
      }, 2000)

      return () => clearTimeout(timeout);
    }
  }, [loggedOut])

  useEffect(() => {
    const userID = window.localStorage.getItem('currentUserID');
    if (isLoggedIn === 'true') {
      if (userID) {
        getUser(userID)
      }
    }
    else {
      setCurrentUser(null);
    }
  }, [isLoggedIn])

  async function login(user = null) {
    window.localStorage.setItem('isLoggedIn', true);
    window.localStorage.setItem('currentUserID', user.id);
    setCurrentUser(user);
  }

  async function logout() {
    setCurrentUser(null);
    if (isLoggedIn === 'true') {
      window.localStorage.removeItem('currentUserID');
      window.localStorage.removeItem('isLoggedIn');
      window.localStorage.removeItem('token');
    }
    navigate('/');
    setLoggedOut(true);
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
      {loggedOut && (
        <Alert variant="success">
          <Alert.Heading>Logged out successfully!</Alert.Heading>
        </Alert>
      )}
      <Routes>
        <Route path="/du35_login" element={<Login login={login} />} />
        <Route path="/du35_signup" element={<SignUp login={login} />} />
        <Route path="/" element={<StoriesList />} />
        <Route path="/du35_stories" element={<StoriesList />} />
        {currentUser && <Route path="/du35_submit" element={<AddStory currentUser={currentUser} />} /> }
        <Route path="/du35_stories/:storyID" element={currentUser ? <Story currentUser={currentUser} /> : <Story />} />
        {currentUser && <Route path="/du35_stories/:storyID/comment" element={<AddComment currentUser={currentUser} />} />}
        <Route path="/du35_profile/:id" element={currentUser ?  <Profile currentUser={currentUser}/> : <Profile />} />
      </Routes>
    </div>
  );
}

export default App;