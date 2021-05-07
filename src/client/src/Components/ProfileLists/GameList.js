import { useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import UserContext from '../../Contexts/UserContext';
import { useParams } from 'react-router-dom';

const GameList = () => {
  const { user } = useContext(UserContext);
  const [tempRank, setTempRank] = useState('');
  const [tempHours, setTempHours] = useState('');
  const [games, setGames] = useState([]);
  const [editting, setEditting] = useState({}); // Game
  const { id } = useParams();
  const [personalPage, setPersonalPage] = useState(false);
  const [gotGames, setGotGames] = useState(false); // Used to check if the get request finished to prevent the change button from rendering before able to check if on personal page
  let idCounter = 0;

  const getGames = useCallback(() => {
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_API}/getGames`,
      params: {
        userID: id
      },
      withCredentials: true
    })
      .then((res) => {
        setGames(res.data.games);

        if (id === user.id) {
          setPersonalPage(true);
        }
        setGotGames(true);
      })
      .catch((err) => console.log(err));
  }, [id, user]);

  useEffect(() => {
    getGames();
  }, [getGames]); // [] to prevent infinite loop from setGames

  const modifyGame = async () => {
    // send request to server to update the description
    try {
      if (tempRank !== editting.rank) {
        if (tempRank === '') {
          setTempRank("Not Set");
        }
        
        let res = await axios({
          method: 'post',
          url: `${process.env.REACT_APP_API}/updateRank`,
          data: {
            username: user,
            gameID: editting.game,
            rank: tempRank
          },
          withCredentials: true
        });
        if (res) {
          setEditting({ ...editting, rank: tempRank });
        }
      }
      if (tempHours !== editting.hours.toString()) {
        let hours = '';
        if (tempHours === '') {
          hours = 0;
        }
        else {
          hours = parseInt(tempHours);
        }
        if (hours !== 0 && !hours) {
          return;
        }
        let res = await axios({
          method: 'post',
          url: `${process.env.REACT_APP_API}/updateHours`,
          data: {
            username: user,
            gameID: editting.game,
            hours: hours
          },
          withCredentials: true
        });
        if (res) {
          setEditting({ ...editting, hours: hours });
        };
      }
      getGames();
      setEditting({}); // Clears and causes a refresh of the list which is needed
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='row'>
      <div
        className='modal fade'
        id='gameRank'
        tabIndex='-1'
        aria-labelledby='gameRankLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content bg-dark'>
            <div className='modal-header'>
              <h5 className='modal-title' id='gameRankLabel'>
                Modify Game Information
              </h5>
              <button
                type='button'
                className='btn-close bg-secondary'
                data-bs-dismiss='modal'
                aria-label='Close'
              ></button>
            </div>
            <div className='modal-body'>
              <p>Change your rank below.</p>
              <div className='form-group text-end'>
                <textarea
                  value={tempRank}
                  onChange={(e) => setTempRank(e.target.value)}
                  className='form-control bg-dark border-grey text-white w-100'
                  rows='1'
                  placeholder='Rank'
                ></textarea>
              </div>
              <p className="mt-3">Change your hours below.</p>
              <div className='form-group text-end'>
                <textarea
                  value={tempHours}
                  onChange={(e) => setTempHours(e.target.value)}
                  className='form-control bg-dark border-grey text-white w-100'
                  rows='1'
                  placeholder='Hours'
                ></textarea>
              </div>
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
                onClick={() =>
                  modifyGame()
                }
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {gotGames && games.length === 0 ? (
        <h5 className="text-center mt-3 mb-5">No games recorded</h5>
      ) : 
      games.map((game) => (
        <div
          className='col-12 col-sm-6 col-md-4 col-lg-3 p-3'
          key={idCounter++} // need unique key
        >
          <div className='card h-100 bg-purple'>
            {game.video ? (
              <iframe
                title='Video'
                className='responsive-iframe card-img-top img-fluid'
                src={game.image}
              ></iframe>
            ) : (
              <div className='bg-dark video-hover'>
                <a href={'/game/' + game.game}>
                  <img
                    className='card-img-top img-fluid'
                    src={game.image}
                    alt='Game'
                  />
                </a>
              </div>
            )}
            <div className='card-body'>
              <a href={'/game/' + game.game}><h5 className='card-title'>{game.title}</h5></a>
              <p className='card-text'>Rank: {game.rank}</p>
              <p className='card-text'>Hours: {game.hours}</p>

              {/* Check if on your own page and only render the change button if you are */}
              {gotGames && personalPage ? (
                <button
                  type='button'
                  className='btn btn-primary long-btn m-1'
                  data-bs-toggle='modal'
                  data-bs-target='#gameRank'
                  onClick={() => {
                    setEditting(game);
                    setTempRank(game.rank);
                    setTempHours(game.hours);
                  }}
                >
                  Modify
                </button>
              ) : null} 
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GameList;
