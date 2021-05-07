import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import UserContext from '../Contexts/UserContext';

const GameContent = () => {
  const { id } = useParams();
  const [hover, setHover] = useState(null);
  const [game, setGame] = useState(null);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [media, setMedia] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [userFavorite, setUserFavorite] = useState(null);
  const { user } = useContext(UserContext);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => getGame(), [id]); // [] to prevent infinite loop

  const getGame = () => {
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_API}/getGameDetails/${id}`,
      data: {},
      withCredentials: true
    })
      .then((res) => {
        setGame(res.data.game);
        setImage(res.data.image);
        setDescription(res.data.description);
        setAverageRating(res.data.averageRating);
        setMedia(res.data.media);
        setUserRating(res.data.userRating);
        setUserFavorite(res.data.favorite);
      })
      .catch((err) => console.log(err));
  };

  const rateGame = (rating) => {
    axios({
      method: 'post',
      url: `${process.env.REACT_APP_API}/setRating`,
      data: {
        id: id,
        rating: rating
      },
      withCredentials: true
    })
      .then(() => getGame())
      .catch((error) => console.log(error));
  };

  const renderType = (obj) => {
    if (obj.type === 'screenshot') {
      return (
        <a href={`/media/${obj.id}`}>
          <img
            className='card-img-top img-fluid'
            src={obj.screenshot}
            alt={obj.title}
          />
        </a>
      );
    } else if (obj.type === 'video') {
      return (
        <a href={`/media/${obj.id}`}>
          <iframe
            title={obj.title}
            className='responsive-iframe card-img-top img-fluid'
            src={obj.video}
          />
        </a>
      );
    }
  };

  const renderMedia = () => {
    if (media === null) return;
    return (
      <div className='row'>
        {media.map((obj) => (
          <div
            className='col-12 col-md-6 col-lg-4 p-3'
            key={JSON.stringify(obj)}
          >
            <div className='card h-100 bg-purple'>
              <div className='bg-dark video-hover'>{renderType(obj)}</div>
              <div className='card-body'>
                <a href={`/media/${obj.id}`}>
                  <h5 className='card-title'>{obj.title}</h5>
                </a>
                <p className='card-text'>
                  Posted By:{' '}
                  <a href={`/profile/${obj.authorID}`}>{obj.authorName}</a>
                </p>
                <p className='card-text'>{obj.created}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const updateFavorite = async () => {
    try {
      let res = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API}/updateFavorite`,
        data: {
          gameID: id
        },
        withCredentials: true
      });
      if (res && 'favorited' in res.data) {
        setUserFavorite(res.data.favorited);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='container-fluid'>
      <h2 className='text-center'>{game}</h2>
      <div className='card border-purple bg-dark text-white text-center m-5 p-3'>
        <div className='row'>
          <div className='col-12 col-md-4 d-flex flex-column justify-content-between'>
            {/* Game cover */}
            <img src={image} className='cover m-3' alt='Game' />

            {/* Average rating of the game */}
            <div>
              <h4>
                Rating:{' '}
                {!averageRating ? 'N/A' : parseFloat(averageRating).toFixed(1)}
              </h4>
              {[...Array(5)].map((star, i) => {
                const currRating = i + 1;
                const className =
                  currRating <= averageRating
                    ? 'fa fa-star fa-2x checked'
                    : currRating - 0.5 <= averageRating
                    ? 'fas fa-star-half-alt fa-2x checked'
                    : 'far fa-star fa-2x';
                return (
                  <span key={'averageRating' + i} className={className} />
                );
              })}
            </div>
          </div>

          <div className='col-12 col-md-8 d-flex flex-column justify-content-between'>
            {/* description */}
            <div className=' border border-lightgray bg-purple rounded m-3 p-5'>
              {description}
            </div>

            {/* User's rating */}
            <div className='row'>
              <div className='col-12 col-md-4'>
                <a className='btn btn-primary btn-lg m-1 py-2' href='/queue'>
                  <div className='px-2'>{game}</div>
                  <div className='px-2'>Queue</div>
                </a>
              </div>
              <div className='col-12 col-md-4'>
                {userFavorite != null ? (
                <button
                  className={'btn btn-primary btn-lg m-1' + (!user ? ' disabled' : '')}
                  onClick={() => updateFavorite()}
                >
                  <p className='p-2 m-0'>
                    {userFavorite ? 'Unfavorite' : 'Favorite'}
                  </p>
                </button>
                ) : null}
              </div>
              <div className='col-12 col-md-4'>
                <h4>Rate This Game</h4>
                {[...Array(5)].map((star, i) => {
                  const currRating = i + 1;
                  return (
                    <span
                      key={'userRating' + i}
                      className={
                        currRating <= (hover || userRating)
                          ? 'fa fa-star fa-2x checked'
                          : 'far fa-star fa-2x'
                      }
                      onClick={() => {
                        setUserRating(currRating);
                        rateGame(currRating);
                      }}
                      onMouseOver={() => setHover(currRating)}
                      onMouseOut={() => setHover(null)}
                      disabled={user ? false : true}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game related media */}
      <div className='card border-purple bg-dark text-center text-white mx-5 p-3'>
        <h2>Media</h2>
        {renderMedia()}
      </div>
    </div>
  );
};

export default GameContent;
