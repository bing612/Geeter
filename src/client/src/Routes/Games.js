import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Games = () => {
  const [games, setGames] = useState(null);
  const [search, setSearch] = useState('');
  const sortMethods = {
    'game-ascending': (
      <React.Fragment>
        <i className='fas fa-sort-alpha-up'></i> Sort by Name: A-Z
      </React.Fragment>
    ),
    'game-descending': (
      <React.Fragment>
        <i className='fas fa-sort-alpha-down'></i> Sort by Name: Z-A
      </React.Fragment>
    ),
    'reviews-descending': (
      <React.Fragment>
        <i className='fas fa-sort-amount-up'></i> Sort by Rating: Best First
      </React.Fragment>
    ),
    'reviews-ascending': (
      <React.Fragment>
        <i className='fas fa-sort-amount-down'></i> Sort by Rating: Best Last
      </React.Fragment>
    )
  };
  const [sort, setSort] = useState(Object.keys(sortMethods)[0]);

  function getGames() {
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_API}/getAllGames`,
      headers: { search: search, sort: sort },
      withCredentials: true
    })
      .then((res) => setGames(res.data.games))
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    getGames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  const display = () => {
    if (games === null) return;
    return (
      <div className='row'>
        {games.map((game) => (
          <div
            className='col-12 col-sm-6 col-md-4 col-lg-3 p-1'
            key={JSON.stringify(game)}
          >
            {/* card header */}
            <div className='card h-100 bg-dark'>
              <a href={`/game/${game._id}`}>
                {game.video ? (
                  <iframe
                    title='Video'
                    className='responsive-iframe card-img-top img-fluid'
                    src={`${game.image}`}
                  ></iframe>
                ) : (
                  <img
                    src={`${game.image}`}
                    className='card-img-top img-fluid'
                    alt={game.game}
                  />
                )}
              </a>
              {/* card body */}
              <div className='card-body'>
                <h5 className='card-text text-truncate'>
                  <a href={`/game/${game._id}`}>{game.game}</a>
                </h5>
                <div className='d-flex justify-content-end'></div>
                <ul className='list-inline'>
                  {game.tags.map((tag) => (
                    <li
                      className='list-inline-item btn-info btn-sm'
                      key={JSON.stringify(tag)}
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <React.Fragment>
      <div className='row'>
        <h2>Games</h2>
        <div className='col d-flex'>
          <div className='me-auto'>
            <div className='form-outline'>
              <form className='input-group'>
                <input
                  type='search'
                  className='form-control'
                  placeholder='Filter by'
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  className='btn btn-outline-success'
                  type='button'
                  onClick={getGames}
                >
                  <i className='fas fa-search'></i>
                </button>
              </form>
            </div>
          </div>
          <div className='ms-auto'>
            <button
              className='btn btn-secondary dropdown-toggle'
              type='button'
              id='dropdownMenuButton'
              data-bs-toggle='dropdown'
              aria-expanded='false'
            >
              {sortMethods[sort]}
            </button>
            <ul
              className='dropdown-menu bg-secondary'
              aria-labelledby='dropdownMenuButton'
            >
              {Object.keys(sortMethods).map((k) => (
                <li
                  className='dropdown-item'
                  key={k}
                  type='button'
                  onClick={() => setSort(k)}
                >
                  {sortMethods[k]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Clips */}
      <div className='my-5'>{display(games, 1)}</div>
    </React.Fragment>
  );
};

export default Games;
