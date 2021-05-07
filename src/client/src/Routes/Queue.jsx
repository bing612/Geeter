import React, { Component } from 'react';
import axios from 'axios';

class Queue extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.filters = {
      'no-filter': (
        <React.Fragment>
          <i className='fas fa-ban'></i> No Filters
        </React.Fragment>
      ),
      'match-rank': (
        <React.Fragment>
          <i className='fas fa-medal'></i> Same Rank
        </React.Fragment>
      ),
      'less-exp': (
        <React.Fragment>
          <i className='fas fa-sort-amount-down'></i> Less Experience
        </React.Fragment>
      ),
      'more-exp': (
        <React.Fragment>
          <i className='fas fa-sort-amount-up'></i> More Experience
        </React.Fragment>
      )
    };
    this.state = {
      alert: null,
      filter: Object.keys(this.filters)[0],
      game: {},
      games: [],
      inQueue: false,
      queues: []
    };

    this.setQueueState = this.setQueueState.bind(this);
    this.setGame = this.setGame.bind(this);
    this.setAlert = this.setAlert.bind(this);
  }

  setQueueState(data = { inQueue: false, queues: [] }) {
    // only setstate if component is mounted
    if (!this._isMounted) return;
    this.setState({
      inQueue: data.inQueue,
      queues: data.queues
    });
  }

  setGame(game) {
    // only setstate if component is mounted
    if (!this._isMounted) return;
    this.setState({ game: game });
  }

  setGames(games) {
    // only setstate if component is mounted
    if (!this._isMounted) return;
    this.setState({ games: games });
  }

  setAlert(alert) {
    // only setstate if component is mounted
    if (!this._isMounted) return;
    this.setState({ alert: alert });
  }

  setFilter(filter) {
    // only setstate if component is mounted
    if (!this._isMounted) return;
    this.setState({ filter: filter });
  }

  async getQueue() {
    try {
      let res = await axios({
        method: 'get',
        url: `${process.env.REACT_APP_API}/getqueue`,
        headers: { gameid: this.state.game.id, filter: this.state.filter },
        withCredentials: true
      });
      this.setQueueState(res.data);
    } catch (err) {
      this.setQueueState();
    }
  }

  async joinQueue() {
    try {
      let res = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API}/joinqueue`,
        data: { gameID: this.state.game.id },
        withCredentials: true
      });
      this.setAlert(res.data);
      this.getQueue();
    } catch (err) {
      if (err.response && err.response.data) this.setAlert(err.response.data);
    }
  }

  async leaveQueue() {
    try {
      let res = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API}/leavequeue`,
        withCredentials: true
      });
      this.setAlert(res.data);
      this.getQueue();
    } catch (err) {
      if (err.response && err.response.data) this.setAlert(err.response.data);
    }
  }

  componentDidMount() {
    this._isMounted = true;
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_API}/getAllGames`,
      withCredentials: true
    })
      .then((obj) => {
        if (obj.data.games) {
          // add All Games option
          obj.data.games.unshift({ id: null, game: 'All Games' });
          this.setGames(obj.data.games);
          this.setGame({
            id: obj.data.games[0]._id,
            game: obj.data.games[0].game
          });
        }
      })
      .catch((err) => {
        this.setGames([]);
        if (err.response && err.response.data)
          this.setAlert(err.response.data);
      });

    // get queue every second
    this.interval = setInterval(() => this.getQueue(), 1000);
  }

  componentWillUnmount() {
    this._isMounted = false;
    clearInterval(this.interval);
  }

  renderJoinLeaveButton() {
    if (this.state.inQueue) {
      return (
        <button className='btn btn-success' onClick={() => this.leaveQueue()}>
          Leave Queue
        </button>
      );
    } else {
      return (
        <React.Fragment>
          <div className='dropdown'>
            <button
              className='btn btn-light dropdown-toggle'
              data-bs-toggle='dropdown'
            >
              {this.state.game.game}
            </button>
            <ul className='dropdown-menu'>
              {this.state.games.map((game) => (
                <li
                  key={`${game._id}`}
                  role='button'
                  className='dropdown-item'
                  onClick={() =>
                    this.setGame({ id: game._id, game: game.game })
                  }
                >
                  {game.game}
                </li>
              ))}
            </ul>
          </div>
          <button className='btn btn-success' onClick={() => this.joinQueue()}>
            Join Queue
          </button>
        </React.Fragment>
      );
    }
  }

  renderAlert() {
    if (!this.state.alert) return;
    return (
      <div
        className='alert alert-warning alert-dismissible fade show mt-2 mb-0'
        role='alert'
      >
        {this.state.alert}
        <button
          className='btn-close'
          data-bs-dismiss='alert'
          aria-label='Close'
        ></button>
      </div>
    );
  }

  renderRows() {
    return (
      <React.Fragment>
        {this.state.queues.map((row) => (
          <tr key={row.id}>
            <th className='fw-normal'>
              <a href={`/game/${row.gameID}`}>{row.game}</a>
            </th>
            <th className='fw-normal'>
              <a href={`/profile/${row.userID}`}>{row.user}</a>
            </th>
            <th className='fw-normal'>{row.rank}</th>
          </tr>
        ))}
      </React.Fragment>
    );
  }

  renderQueue() {
    if (this.state.queues.length === 0)
      return (
        <tbody>
          <tr>
            <th>No queues found! Start your own queue?</th>
          </tr>
        </tbody>
      );

    return (
      <React.Fragment>
        <thead>
          <tr className='text-decoration-underline'>
            <th scope='col'>Game</th>
            <th scope='col'>User</th>
            <th scope='col'>Rank</th>
          </tr>
        </thead>
        <tbody>{this.renderRows()}</tbody>
      </React.Fragment>
    );
  }

  render() {
    return (
      <React.Fragment>
        {/* Title */}
        <h2>Queue</h2>

        {/* Header */}
        <div className='d-flex'>
          {/* Join or leave queue */}
          <div className='me-auto'>
            <div className='input-group flex-nowrap'>
              {this.renderJoinLeaveButton()}
            </div>
          </div>

          {/* Sort dropdown */}
          <div className='ms-auto'>
            <button
              className='btn btn-secondary dropdown-toggle'
              type='button'
              id='dropdownMenuButton'
              data-bs-toggle='dropdown'
              aria-expanded='false'
            >
              {this.filters[this.state.filter]}
            </button>
            <ul
              className='dropdown-menu bg-secondary'
              aria-labelledby='dropdownMenuButton'
            >
              {Object.keys(this.filters).map((k) => (
                <li
                  className='dropdown-item'
                  key={k}
                  onClick={() => this.setFilter(k)}
                  type='button'
                >
                  {this.filters[k]}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Refresh button */}
        <div className='d-flex mt-1'>
          <div className='ms-auto'>
            <button
              className='btn btn-primary me-1'
              onClick={() => this.getQueue()}
            >
              Refresh <i className='fas fa-sync-alt'></i>
            </button>
          </div>
        </div>

        {/* Error display */}
        {this.renderAlert()}

        {/* Rows */}
        <div className='row mt-2'>
          <div className='col'>
            <table className='table table-success table-striped table-hover'>
              {this.renderQueue()}
            </table>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Queue;
