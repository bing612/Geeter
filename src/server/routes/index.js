const router = require('express').Router();
const API_URL = process.env.API_URL;
const { upload } = require('../config/multer');

// testing routes
if (process.env.DEBUG) {
  // hide favicon.ico error
  router.get('/favicon.ico', (_req, res) => res.status(200));

  // get root testing page
  router.get('/', require('../testing/index'));

  // post test
  router.post(`${API_URL}/test`, (req, res) =>
    res.status(200).send(`Success, ${JSON.stringify(req.body)}`)
  );
}

// authentication-related routes
const { check, session, signup, signin, signout } = require('./auth');
router.post(`${API_URL}/session`, [check, session]);
router.post(`${API_URL}/signup`, signup);
router.post(`${API_URL}/signin`, signin);
router.post(`${API_URL}/signout`, signout);

// queue-related routes
const { getQueue, joinQueue, leaveQueue } = require('./queue');
router.get(`${API_URL}/getqueue`, [check, getQueue]);
router.post(`${API_URL}/joinqueue`, [check, joinQueue]);
router.post(`${API_URL}/leavequeue`, [check, leaveQueue]);

// User related routes
const {
  updateDescription,
  updateUsername,
  updatePassword,
  updateCommends,
  getUserDetails,
  updateImage,
  updateRank,
  getGames,
  blockUser,
  updateHours,
  getMedia,
  updateFavorite,
  followUser,
  getUserFriends
} = require('./user');
router.post(`${API_URL}/updateDescription`, [check, updateDescription]);
router.post(`${API_URL}/updateUsername`, [check, updateUsername]);
router.post(`${API_URL}/updatePassword`, [check, updatePassword]);
router.post(`${API_URL}/updateCommends`, [check, updateCommends]);
router.get(`${API_URL}/getUserDetails`, getUserDetails);
router.post(`${API_URL}/updateImage`, [check, upload, updateImage]);
router.post(`${API_URL}/updaterank`, [check, updateRank]);
router.post(`${API_URL}/blockUser`, [check, blockUser]);
router.post(`${API_URL}/updateRank`, [check, updateRank]);
router.post(`${API_URL}/updateHours`, [check, updateHours]);
router.get(`${API_URL}/getGames`, getGames);
router.get(`${API_URL}/getMedia`, getMedia);
router.post(`${API_URL}/updateFavorite`, [check, updateFavorite]);
router.post(`${API_URL}/followUser`, [check, followUser]);
router.get(`${API_URL}/getUserFriends`, getUserFriends);

const {
  getPost,
  updateLikes,
  getAllPosts,
  uploadData,
  deleteMedia
} = require('./media');
router.get(`${API_URL}/getPost`, getPost);
router.post(`${API_URL}/updateLikes`, [check, updateLikes]);
router.get(`${API_URL}/getAllPosts`, getAllPosts);
router.post(`${API_URL}/upload`, [check, upload, uploadData]);
router.delete(`${API_URL}/deleteMedia`, [check, deleteMedia]);

// Game related routes
const { postGame, getGameDetails, getAllGames, setRating } = require('./game');
router.post(`${API_URL}/postGame`, [check, postGame]);
router.post(`${API_URL}/setRating`, [check, setRating]);
router.get(`${API_URL}/getGameDetails/:id`, getGameDetails);
router.get(`${API_URL}/getAllGames`, getAllGames);

module.exports = router;
