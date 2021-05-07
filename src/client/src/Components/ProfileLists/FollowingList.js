import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const FollowingList = () => {
  const [friends, setFriends] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_API}/getUserFriends`,
      params: {
        userID: id
      },
      withCredentials: true
    })
      .then((res) => setFriends(res.data.friends))
      .catch((err) => {
        console.log(err);
      });
  }, [id]); // [] to prevent infinite loop

  return (
    <div className='pt-3 mx-0 px-0 mx-md-2 px-md-1 mx-lg-5 px-lg-5'>
      {friends.map((friend) => (
        <div className='card mx-5 mb-4 p-3 bg-purple' key={friend.username}>
          <div className='row'>
            <div className='col-12 col-md-4 col-lg-3 video-hover my-auto'>
              <a href={`/profile/${friend.id}`}>
                <img
                  className='card-img-top img-fluid mw-100 h-auto'
                  src={friend.picture}
                  alt='Friend'
                />
              </a>
            </div>
            <div className='col-12 col-md-8 col-lg-9'>
              <div className='card-body'>
                <h5 className='card-title'>
                  <a href={`/profile/${friend.id}`}>{friend.username}</a>
                </h5>
                <p className='card-text'>{friend.description}</p>
                {/* <p className='card-text'> */}
                Played Games:{' '}
                <ul className='list-inline'>
                  {friend.games.map((game) => (
                    <a
                      className='m-1'
                      href={`/game/${game.id}`}
                      key={friend.username + game.game}
                    >
                      <li className='list-inline-item btn-info btn-sm'>
                        {game.game}
                      </li>
                    </a>
                  ))}
                </ul>
                {/* </p> */}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FollowingList;
