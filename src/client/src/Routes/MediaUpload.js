import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import UserContext from '../Contexts/UserContext';

const MediaUpload = () => {
  const contentTypes = ['Text', 'Screenshot', 'Video'];
  const [type, setType] = useState(contentTypes[0]);
  const [title, setTitle] = useState('');
  const [game, setGame] = useState({});
  const [games, setGames] = useState([]);
  const [video, setVideo] = useState('');
  const [text, setText] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('');
  const fileInput = useRef();
  const { user } = useContext(UserContext);

  useEffect(() => {
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_API}/getAllGames`,
      withCredentials: true
    })
      .then((res) => {
        setGames(res.data.games);
        if (res.data.games.length > 0)
          setGame({ id: res.data.games[0]._id, game: res.data.games[0].game });
      })
      .catch((e) => {
        if (e && e.response) setStatus(e.response.data);
      });
  }, []);

  const uploadMedia = () => {
    let form = new FormData();
    form.append('title', title);
    form.append('type', type.toLowerCase());
    form.append('gameID', game.id);
    form.append('tags', tags);
    form.append('video', video);
    form.append('text', text);
    if (fileInput && fileInput.current && fileInput.current.files)
      form.append('image', fileInput.current.files[0]);

    axios({
      method: 'post',
      url: `${process.env.REACT_APP_API}/upload`,
      data: form,
      withCredentials: true
    })
      .then((res) => setStatus(res.data.mediaID))
      .catch((e) => {
        if (e && e.response) setStatus(e.response.data);
      });
  };

  const renderGamesDropdown = () => {
    return (
      <div className='d-flex flex-grow-1 bd-highlight'>
        <button
          className='justify-content-center btn btn-secondary dropdown-toggle'
          type='button'
          id='gamesDropdown'
          data-bs-toggle='dropdown'
          aria-expanded='false'
        >
          {game.game}
        </button>
        <ul
          className='dropdown-menu bg-secondary'
          aria-labelledby='gamesDropdown'
        >
          {games.map((game) => {
            return (
              <li
                className='dropdown-item'
                onClick={() => setGame({ id: game._id, game: game.game })}
                key={game._id}
              >
                {game.game}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const renderTypesDropdown = () => {
    return (
      <div className='d-flex flex-grow-1 bd-highlight'>
        <button
          className='justify-content-center btn btn-secondary dropdown-toggle'
          type='button'
          id='typesDropdown'
          data-bs-toggle='dropdown'
          aria-expanded='false'
        >
          {type}
        </button>
        <ul
          className='dropdown-menu bg-secondary'
          aria-labelledby='typesDropdown'
        >
          {contentTypes.map((type) => {
            return (
              <li
                className='dropdown-item'
                onClick={() => setType(type)}
                key={type}
              >
                {type}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const renderContent = () => {
    switch (type) {
      case 'Screenshot':
        return (
          // Picture Upload
          <input type='file' ref={fileInput}></input>
        );

      case 'Video':
        return (
          // Youtube URL
          <input
            type='text'
            className='form-control'
            placeholder='Youtube URL'
            onInput={(e) => setVideo(e.target.value)}
          />
        );

      case 'Text':
        return (
          // Text
          <div className='form-group'>
            <textarea
              className='form-control'
              placeholder='Text Content'
              rows='15'
              onInput={(e) => setText(e.target.value)}
            ></textarea>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      <h1>Upload Media</h1>
      <div className='me-auto mb-2 bd-highlight'>
        <input
          type='text'
          className='form-control'
          placeholder='Title'
          onInput={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className='d-flex'>
        {renderGamesDropdown()}
        {renderTypesDropdown()}
      </div>
      <div className='me-auto mt-2'>
        <input
          type='text'
          className='form-control'
          placeholder='Tags, separated with commas'
          onInput={(e) => setTags(e.target.value)}
        />
      </div>
      <hr />
      {renderContent()}
      <hr />
      <button
        className='btn btn-secondary'
        type='button'
        aria-expanded='false'
        onClick={() => uploadMedia()}
        disabled={user ? false : true}
      >
        Upload
      </button>
      {status ? (
        <React.Fragment>
          <hr />
          <p>
            <a
              href={`/media/${status}`}
            >{`Nice, click here to see your post!`}</a>
          </p>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
};

export default MediaUpload;
