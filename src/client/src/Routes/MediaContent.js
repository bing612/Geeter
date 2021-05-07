import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../Contexts/UserContext';

const MediaContent = () => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [constItems, setConstItems] = useState({}); // media data
  const { id } = useParams();
  const user = useContext(UserContext);

  useEffect(() => {
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_API}/getPost`,
      params: {
        postID: id
      },
      withCredentials: true
    })
      .then((res) => {
        let localItems = {};
        localItems.id = res.data.id;
        localItems.title = res.data.title;
        localItems.authorID = res.data.authorID;
        localItems.authorName = res.data.authorName;
        localItems.gameID = res.data.gameID;
        localItems.gameName = res.data.gameName;
        localItems.created = res.data.created;
        localItems.tags = res.data.tags;
        localItems.type = res.data.type;
        localItems.likes = res.data.likes;
        localItems.hasLiked = res.data.hasLiked;

        switch (localItems.type) {
          case 'screenshot':
            localItems.screenshot = res.data.screenshot;
            break;
          case 'video':
            localItems.video = res.data.video;
            break;
          case 'text':
            localItems.text = res.data.text;
            break;
          default:
            // invalid media, delete everything
            localItems = {};
        }
        setConstItems(localItems);

        setLikes(res.data.likes);
        setLiked(res.data.hasLiked);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const updateLikes = async () => {
    // Send get req to updateLikes route
    try {
      let res = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API}/updateLikes`,
        data: {
          postID: id
        },
        withCredentials: true
      });
      if (res) {
        setLikes(res.data.likes);
        setLiked(res.data.hasLiked);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderContent = () => {
    switch (constItems.type) {
      case 'screenshot':
        return (
          <img
            className='bg-dark text-center'
            src={constItems.screenshot}
            alt={constItems.title}
          />
        );
      case 'video':
        return (
          <div className='ratio ratio-16x9'>
            <iframe
              src={constItems.video}
              title={constItems.title}
              allowFullScreen
            ></iframe>
          </div>
        );
      case 'text':
        return <p className='p-3'>{constItems.text}</p>;
      default:
        return null;
    }
  };

  return (
    <div className='row d-flex'>
      <div className='col-12 col-md-10 mx-auto'>
        <h2 className='text-center'>{constItems.title}</h2>
        <div className='card border-grey bg-dark mx-auto p-3'>
          {renderContent()}
          <div className='card-body'>
            <div className='row rounded border-grey p-3 text-center'>
              <div className='col'>
                <p className='m-0'>
                  Posted By:{' '}
                  <a href={`/profile/${constItems.authorID}`}>
                    @{constItems.authorName}
                  </a>
                </p>
              </div>
              <div className='col'>
                <p className='m-0'>Posted: {constItems.created}</p>
              </div>
              <div className='col'>
                <p className='m-0'>
                  Game:{' '}
                  <a href={`/game/${constItems.gameID}`}>
                    {constItems.gameName}
                  </a>
                </p>
              </div>
              <div className='col'>
                {user.user.username ? (
                  <button
                    className='btn-primary d-inline rounded'
                    onClick={() => updateLikes()}
                  >
                    {!liked ? (
                      <i className='far fa-heart d-inline pe-1' />
                    ) : (
                      <i className='fas fa-heart d-inline pe-1' />
                    )}
                    {likes}
                  </button>
                ) : (
                  // Not logged in view is a disabled default like button
                  <button className='btn-secondary d-inline rounded' disabled>
                    <i className='far fa-heart d-inline pe-1' />
                    {likes}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaContent;
