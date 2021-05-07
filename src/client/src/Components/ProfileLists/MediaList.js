import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import UserContext from '../../Contexts/UserContext';
import { useParams } from 'react-router-dom';

const MediaList = () => {
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const [mediaList, setMediaList] = useState([]);
  const [personalPage, setPersonalPage] = useState(false);
  const [gotMedia, setGotMedia] = useState(false);
  let idCounter = 0;

  useEffect(() => {
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_API}/getMedia`,
      params: {
        userID: id
      },
      withCredentials: true
    })
      .then((res) => {
        setMediaList(res.data.media);

        if (id === user.id) {
          setPersonalPage(true);
        }
        setGotMedia(true);
      })
      .catch((err) => console.log(err));
  }, [id, user]);

  const deleteMedia = async (postToDelete) => {
    axios({
      method: 'delete',
      url: `${process.env.REACT_APP_API}/deleteMedia`,
      data: {
        mediaID: postToDelete.mediaID,
        gameID: postToDelete.gameID
      },
      withCredentials: true
    })
      .then(res => {
        setMediaList(mediaList.filter(post => post._id.toString() !== postToDelete.mediaID));
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className='row'>
      {gotMedia && mediaList.length === 0 ? (
        <h5 className="text-center mt-3 mb-5">No media recorded</h5>
      ) : 
      mediaList.map((media) => (
        <div
          className='col-12 col-sm-6 col-md-4 col-lg-3 p-3'
          key={idCounter++} // need unique key
        >
          <div className='card h-100 bg-purple'>
            {gotMedia && media.type === "screenshot" ? (
              <div className='bg-dark video-hover'>
                <a href={'/media/' + media._id}>
                  <img
                    className='card-img-top img-fluid'
                    src={media.screenshot}
                    alt='media'
                  />
                </a>
              </div>
            ) : 
            media.type === "video" ? (
              <iframe
                title='Video'
                className='responsive-iframe card-img-top img-fluid'
                src={media.video}
              ></iframe>
            ) : null}
            <div className='card-body'>
              <a href={'/media/' + media._id}><h5 className='card-title'>{media.title}</h5></a>
              <p className="card-text"><a href={'/game/' + media.gameID}>{media.game}</a></p>
              <p className='card-text'><a href={'/profile/' + media.authorID}>Posted by: @{media.author}</a></p>
              {gotMedia && personalPage ? (
                <button
                  type='button'
                  className='btn btn-danger long-btn m-1'
                  onClick={() => {
                    deleteMedia({mediaID: media._id, gameID: media.gameID});
                  }}
                >
                  Delete Post
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MediaList;
