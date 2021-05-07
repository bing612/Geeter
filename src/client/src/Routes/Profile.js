import React, { useState, useContext, useEffect, useRef } from 'react';
import Avatar from '../avatar.png';
import HomeList from '../Components/ProfileLists/HomeList';
import GameList from '../Components/ProfileLists/GameList';
import MediaList from '../Components/ProfileLists/MediaList';
import FollowingList from '../Components/ProfileLists/FollowingList';
import axios from 'axios';
import UserContext from '../Contexts/UserContext';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  // Set these to the actual commend amounts later when context gets more info added to it
  const [skillful, setSkill] = useState(0);
  const [friendly, setFriendly] = useState(0);
  const [knowledgeable, setKnowledge] = useState(0);
  const [friend, setFriend] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [tab, setTab] = useState('Home');
  const [desc, setDesc] = useState('');
  const [tempDesc, setTempDesc] = useState('');
  const [tempUsername, setTempUsername] = useState(user.username);
  const [profilePic, setProfilePic] = useState(false);
  const fileInput = useRef();
  const [password, setPassword] = useState(false);
  // The id provided in the route
  const { id } = useParams();
  // true = on the logged in user's page / id in route matches logged in user's id
  const [personalPage, setPersonalPage] = useState(false);
  const [username, setUsername] = useState(false);
  // This is to hide the page prior to state updates
  // in case we need to give a 404 or block message.
  // Set to: "initial", "visible", "404" or, "blocked".
  const [hidden, setHidden] = useState('initial');
  const [commends, setCommends] = useState({
    skillful: false,
    friendly: false,
    knowledgeable: false
  });

  useEffect(() => {
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_API}/getUserDetails`,
      params: {
        userID: id
      },
      withCredentials: true
    })
      .then((res) => {
        setUsername(res.data.username);
        setDesc(res.data.description);
        setTempDesc(res.data.description);
        setSkill(res.data.commendations.skillful);
        setFriendly(res.data.commendations.friendly);
        setKnowledge(res.data.commendations.knowledgeable);
        setBlocked(res.data.blocked);
        setHidden(res.data.hidden);
        setCommends(res.data.hasCommended);
        setFriend(res.data.friend);
        setProfilePic(res.data.picture);

        if (id === user.id) setPersonalPage(true);
      })
      .catch((err) => {
        console.log(err);
        setHidden('404');
      });
  }, [id, user]); // [] to prevent infinite loop

  // render short row of tabs
  const renderTabs = () => {
    let home = tab === 'Home' ? 'active tab' : 'tab';
    let games = tab === 'Games' ? 'active tab' : 'tab';
    let media = tab === 'Media' ? 'active tab' : 'tab';
    let frnd = tab === 'Following' ? 'active tab' : 'tab';
    return (
      <React.Fragment>
        <span className={home} role='button' onClick={() => setTab('Home')}>
          Home
        </span>
        <span className={games} role='button' onClick={() => setTab('Games')}>
          Games
        </span>
        <span className={media} role='button' onClick={() => setTab('Media')}>
          Media
        </span>
        <span
          className={frnd}
          role='button'
          onClick={() => setTab('Following')}
        >
          Following
        </span>
      </React.Fragment>
    );
  };

  // pick type of content to list out
  const renderContentList = () => {
    switch (tab) {
      case 'Home':
        return <HomeList />;
      case 'Games':
        return <GameList />;
      case 'Media':
        return <MediaList />;
      case 'Following':
        return <FollowingList />;
      default:
        return null;
    }
  };

  const updateDescription = async (newDesc) => {
    // send request to server to update the description
    try {
      let res = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API}/updateDescription`,
        data: {
          username: user.username,
          description: newDesc
        },
        withCredentials: true
      });
      if (res) setDesc(newDesc);
    } catch (error) {
      console.log(error);
    }
  };

  const updateUsername = async (newUsername) => {
    try {
      let res = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API}/updateUsername`,
        data: {
          username: newUsername
        },
        withCredentials: true
      });
      if (res) setUser(newUsername);
    } catch (error) {
      console.log(error);
    }
  };

  const updatePassword = () => {
    axios({
      method: 'post',
      url: `${process.env.REACT_APP_API}/updatePassword`,
      data: { password: password },
      withCredentials: true
    })
      .then(() => setPassword(false))
      .catch((error) => console.log(error));
  };

  const updateCommends = async (
    updateSkillful,
    updateFriendly,
    updateKnowledgeable
  ) => {
    try {
      let res = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API}/updateCommends`,
        data: {
          userID: id,
          updateSkillful: updateSkillful,
          updateFriendly: updateFriendly,
          updateKnowledgeable: updateKnowledgeable
        },
        withCredentials: true
      });
      if (res) {
        setSkill(res.data.skillful);
        setFriendly(res.data.friendly);
        setKnowledge(res.data.knowledgeable);
        setCommends({
          skillful: res.data.skillCommended,
          friendly: res.data.friendlyCommended,
          knowledgeable: res.data.knowledgeableCommended
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateImage = async (newImage) => {
    try {
      let form = new FormData();
      form.append('image', fileInput.current.files[0]);

      let res = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API}/updateImage`,
        data: form,
        withCredentials: true
      });
      if (res) setProfilePic(res.data.picture);
    } catch (error) {
      console.log(error);
    }
  };

  const saveChanges = async (newUsername, newDesc) => {
    if (newUsername !== user.username) {
      updateUsername(newUsername);
    }
    if (newDesc !== desc) {
      updateDescription(newDesc);
    }
    if (fileInput && fileInput.current && fileInput.current.files) {
      updateImage(fileInput.current.files[0]);
    }
    if (password) updatePassword();
  };

  const blockUser = async () => {
    try {
      let res = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API}/blockUser`,
        data: { userID: id },
        withCredentials: true
      });
      if (res) {
        setBlocked(res.data.blocked);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const followUser = async () => {
    try {
      let res = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API}/followUser`,
        data: { userID: id },
        withCredentials: true
      });
      if (res) {
        setFriend(res.data.friend);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return hidden === '404' ? (
    <h1 className='text-center'>404 User not found</h1>
  ) : hidden === 'blocked' ? (
    <h1 className='text-center'>This user has blocked you</h1>
  ) : hidden === 'visible' ? (
    <React.Fragment>
      <div className='row'>
        <div className='col'>
          <div className='card border-purple bg-dark text-white text-center m-5 p-3'>
            <div className='row'>
              <div className='col-12 col-md-4 d-flex flex-column justify-content-between'>
                {/* profile avatar */}
                <img
                  src={profilePic ? profilePic : Avatar}
                  className='avatar m-auto rounded-circle'
                  alt='Profile Avatar'
                />

                {/* div used here to align user options to bottom of card */}
                <div>
                  <p>@{username}</p>
                  {username && !personalPage ? (
                    // username is used to check if data has been pulled from server yet.
                    // Without it you risk making a button visible for a fraction of a second.
                    // If you were to click settings on another user's profile that would be an issue
                    // (it would only edit your personal profile not the other user's but still not ideal).
                    <React.Fragment>
                      <button
                        onClick={() => followUser()}
                        className={
                          'btn btn-primary long-btn m-1' +
                          (!user ? ' disabled' : '')
                        }
                      >
                        {friend ? 'Unfollow' : 'Follow'}
                      </button>
                      <button
                        onClick={() => blockUser()}
                        className={
                          'btn btn-danger long-btn m-1' +
                          (!user ? ' disabled' : '')
                        }
                      >
                        {blocked ? 'Unblock User' : 'Block User'}
                      </button>
                    </React.Fragment>
                  ) : username ? (
                    <button
                      type='button'
                      className='btn btn-secondary long-btn m-1'
                      data-bs-toggle='modal'
                      data-bs-target='#profileSettings'
                    >
                      Settings
                    </button>
                  ) : null}

                  <div
                    className='modal fade'
                    id='profileSettings'
                    tabIndex='-1'
                    aria-labelledby='profileSettingsLabel'
                    aria-hidden='true'
                  >
                    <div className='modal-dialog'>
                      <div className='modal-content bg-dark'>
                        <div className='modal-header'>
                          <h5
                            className='modal-title'
                            id='profileSettingsLabel'
                          >
                            Profile Settings
                          </h5>
                          <button
                            type='button'
                            className='btn-close bg-secondary'
                            data-bs-dismiss='modal'
                            aria-label='Close'
                          ></button>
                        </div>
                        <div className='modal-body'>
                          <p>Username:</p>
                          <div className='form-group text-end'>
                            <input
                              className='form-control bg-dark text-white border-grey'
                              value={tempUsername}
                              placeholder='Username'
                              onChange={(e) => setTempUsername(e.target.value)}
                            ></input>
                          </div>

                          <p>Password:</p>
                          <div className='form-group text-end'>
                            <input
                              className='form-control bg-dark text-white border-grey'
                              placeholder='Password'
                              type='password'
                              onChange={(e) => setPassword(e.target.value)}
                            ></input>
                          </div>

                          <p className='mt-3'>Description:</p>
                          <div className='form-group text-end'>
                            <textarea
                              value={tempDesc}
                              onChange={(e) => setTempDesc(e.target.value)}
                              className='form-control bg-dark border-grey text-white w-100'
                              rows='6'
                              placeholder='Description'
                            ></textarea>
                          </div>

                          <p className='mt-3'>Upload Profile Picture:</p>
                          <input type='file' ref={fileInput} />
                        </div>
                        <div className='modal-footer'>
                          <button
                            type='button'
                            className='btn btn-secondary'
                            data-bs-dismiss='modal'
                          >
                            Close
                          </button>
                          <button
                            type='button'
                            className='btn btn-primary'
                            data-bs-dismiss='modal'
                            onClick={() => saveChanges(tempUsername, tempDesc)}
                          >
                            Save changes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-12 col-md-8 d-flex flex-column justify-content-between'>
                {/* description */}
                <div className='border border-secondary bg-purple rounded m-3 p-5'>
                  {desc}
                </div>

                {/* div used here to align buttons to bottom of card */}
                <div>
                  <h5>Commendations</h5>
                  <button
                    onClick={() => updateCommends(true, false, false)}
                    data-toggle='button'
                    className={
                      'btn long-btn m-1' +
                      (commends.skillful ? ' btn-primary' : ' btn-secondary') +
                      (!user || personalPage ? ' disabled' : '')
                    }
                  >
                    Skillful: {skillful}
                  </button>
                  <button
                    onClick={() => updateCommends(false, true, false)}
                    data-toggle='button'
                    className={
                      'btn long-btn m-1' +
                      (commends.friendly ? ' btn-primary' : ' btn-secondary') +
                      (!user || personalPage ? ' disabled' : '')
                    }
                  >
                    Friendly: {friendly}
                  </button>
                  <button
                    onClick={() => updateCommends(false, false, true)}
                    data-toggle='button'
                    className={
                      'btn long-btn m-1' +
                      (commends.knowledgeable
                        ? ' btn-primary'
                        : ' btn-secondary') +
                      (!user || personalPage ? ' disabled' : '')
                    }
                  >
                    Knowledgeable: {knowledgeable}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* lists row */}
      <div className='row'>
        <div className='col'>
          <div className='card border-purple bg-dark text-center text-white mx-5 p-3'>
            <div className='mb-4'>{renderTabs()}</div>
            {renderContentList()}
          </div>
        </div>
      </div>
    </React.Fragment>
  ) : null;
};

export default Profile;
