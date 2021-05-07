const { isValidObjectId } = require('mongoose');
const User = require('../models/user');
const Queue = require('../models/queue');
const Game = require('../models/game');

const getQueue = async (req, res) => {
  // force game name to be a string
  let query = {};
  if (isValidObjectId(`${req.headers.gameid}`))
    query.game = `${req.headers.gameid}`;

  try {
    // find all queues
    let allQueues = await Queue.find(query);

    // create array of queue objects
    let parsedQueues = [];
    let userInQueue = false;

    for (const row of allQueues) {
      // check if user is in queue
      if (!userInQueue && req.user.id == row.user) userInQueue = true;

      // query for user for username
      let user = await User.findById(`${row.user}`);

      // ignore queue if the host blocked current user.
      if (req.user && user.blacklist.includes(`${req.user.id}`)) continue;

      const userGame = user.games.find((x) => x.game.equals(row.game));
      const game = await Game.findById(row.game);
      if (!game) continue;

      let reqUserGame = null;
      if (req.headers.filter)
        reqUserGame = req.user.games.find((x) => x.game.equals(row.game));

      // queue filters
      switch (req.headers.filter) {
        case 'match-rank':
          if (!reqUserGame || !userGame || userGame.rank !== reqUserGame.rank)
            continue;
        case 'less-exp':
          if (!reqUserGame || !userGame || userGame.hours >= reqUserGame.hours)
            continue;
        case 'more-exp':
          if (!reqUserGame || !userGame || userGame.hours < reqUserGame.hours)
            continue;
        default:
          break;
      }

      // append to array
      parsedQueues.push({
        id: row.id,
        gameID: row.game,
        game: game.game,
        rank: userGame ? userGame.rank : 'Not Set',
        userID: user ? user.id : null,
        user: user ? user.username : null
      });
    }

    return res
      .status(200)
      .send({ inQueue: userInQueue, queues: parsedQueues });
  } catch (e) {
    return res.status(500).send('Internal Server Error');
  }
};

const joinQueue = async (req, res) => {
  // validate user id
  if (!req.user.id) return res.status(403).send('Please signin.');
  if (!req.body.gameID) return res.status(400).send('Please pick a game.');

  try {
    const game = await Game.findById(`${req.body.gameID}`);
    if (!game) return res.status(400).send('Please pick a valid game.');

    await Queue.create({
      game: game.id,
      user: req.user.id
    });
    return res.status(200).send('You have joined the queue.');
  } catch (e) {
    return res.status(500).send('Internal Server Error');
  }
};

const leaveQueue = async (req, res) => {
  // validate user id
  if (!req.user.id) return res.status(403).send('Please signin.');
  try {
    let result = await Queue.deleteOne({ user: req.user.id });
    // check if any users have been deleted
    if (result.deletedCount === 0)
      return res.status(403).send('You have not joined the queue.');
    return res.status(200).send('You have left the queue.');
  } catch (e) {
    return res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  getQueue: getQueue,
  joinQueue: joinQueue,
  leaveQueue: leaveQueue
};
