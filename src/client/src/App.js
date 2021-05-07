import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import UserContext from './Contexts/UserContext';
import Navbar from './Components/Navbar';
import Games from './Routes/Games';
import Community from './Routes/Community';
import Queue from './Routes/Queue';
import Signup from './Routes/Signup';
import Signin from './Routes/Signin';
import Signout from './Routes/Signout';
import Profile from './Routes/Profile';
import MediaContent from './Routes/MediaContent';
import GameContent from './Routes/GameContent';
import MediaUpload from './Routes/MediaUpload';

function getLocalStorage(key, defaultValue) {
  try {
    const value = localStorage.getItem(key);
    // if value cannot be found, then return default
    return value ? JSON.parse(value) : defaultValue;
  } catch (err) {
    // if error, return initial value
    return defaultValue;
  }
}

function setLocalStorage(key, value) {
  try {
    if (value) {
      // signin
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      // signout
      localStorage.removeItem(key);
    }
  } catch (err) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
    alert(`Error: local storage ${err.name}`);
  }
}

function App() {
  // this is a simplified version of Hangindev's code at
  // https://stackoverflow.com/a/62505656
  const [user, setUser] = useState(() => getLocalStorage('username', false));
  const value = useMemo(() => ({ user, setUser }), [user]);

  // update localStorage on user change
  useEffect(() => {
    setLocalStorage('username', user);
  }, [user]);

  return (
    <UserContext.Provider value={value}>
      <Navbar />
      <div className='container-fluid p-3'>
        <BrowserRouter>
          <Switch>
            <Redirect exact from='/' to='/community' />
            <Route exact path='/community' component={Community} />
            <Route exact path='/games' component={Games} />
            <Route exact path='/queue' component={Queue} />
            <Route exact path='/signup' component={Signup} />
            <Route exact path='/signin' component={Signin} />
            <Route exact path='/signout' component={Signout} />
            <Route exact path='/profile/:id' component={Profile} />
            <Route exact path='/media/:id' component={MediaContent} />
            <Route exact path='/game/:id' component={GameContent} />
            <Route exact path='/upload' component={MediaUpload} />
          </Switch>
        </BrowserRouter>
      </div>
    </UserContext.Provider>
  );
}

export default App;
