const { isValidObjectId } = require('mongoose');
const { ObjectId } = require('mongoose').Types;
const UserModel = require('../models/user');
const GameModel = require('../models/game');
const PostModel = require('../models/posts');
const { isValidImage } = require('../config/multer');
const { generatePassword } = require('./auth');

const updateUsername = async (req, res) => {
  try {
    const newUsername = `${req.body.username}`;
    const existingUser = await UserModel.findById(newUsername);
    if (existingUser) return res.status(400).send('Username is taken');

    req.user.username = newUsername;
    const result = await req.user.save();
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
};

const updatePassword = async (req, res) => {
  if (!req.body.password) return res.status(400).send('No password entered');
  try {
    // generate salt and hash
    let hash = generatePassword(`${req.body.password}`);
    if (!hash) return res.status(500).send('Internal Server Error');

    req.user.hash = hash;
    const result = await req.user.save();
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
};

const updateDescription = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).send('User not found');

    user.description = req.body.description;
    const result = await user.save();
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
};

// Sends basic user details: username, description, commends
const getUserDetails = async (req, res) => {
  try {
    if (!isValidObjectId(req.query.userID)) {
      return res.status(404).send('User not found');
    }
    const user = await UserModel.findById(req.query.userID);
    if (!user) {
      return res.status(404).send('User not found');
    }

    let data = {
      picture: false,
      blocked: false,
      friend: false,
      hidden: 'visible',
      hasCommended: {}
    };

    if (isValidImage(user.picture.contentType)) {
      let b64 = Buffer.from(user.picture.data).toString('base64');
      data.picture = `data:${user.picture.contentType};base64,${b64}`;
    }

    if (
      req.isAuthenticated() &&
      req.user &&
      req.query.userID !== req.user.id
    ) {
      if (user.blacklist.includes(`${req.user.id}`)) {
        data.hidden = 'blocked';
      } else {
        data.blocked = req.user.blacklist.includes(`${req.query.userID}`);
        data.friend = req.user.friends.includes(`${req.query.userID}`);
        data.hasCommended.skillful =
          user.commendedBy.skillful.filter(
            (id) => id.toString() === req.user.id
          ).length > 0;
        data.hasCommended.friendly =
          user.commendedBy.friendly.filter(
            (id) => id.toString() === req.user.id
          ).length > 0;
        data.hasCommended.knowledgeable =
          user.commendedBy.knowledgeable.filter(
            (id) => id.toString() === req.user.id
          ).length > 0;
      }
    }

    if (data.hidden === 'blocked') {
      data.username = null;
      data.description = null;
      data.commendations = {
        skillful: null,
        friendly: null,
        knowledgeable: null
      };
    } else {
      data.username = user.username;
      data.description = user.description;
      data.commendations = {
        skillful: user.commendation.skillful,
        friendly: user.commendation.friendly,
        knowledgeable: user.commendation.knowledgeable
      };
    }

    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
};

const updateCommends = async (req, res) => {
  try {
    if (!isValidObjectId(req.body.userID)) {
      return res.status(400).send('Invalid user id');
    }
    const user = await UserModel.findById(req.body.userID);
    if (!user) return res.status(404).send('User not found');

    let commended = { skillful: false, friendly: false, knowledgeable: false };

    if (
      user.commendedBy.skillful.filter((id) => id.toString() === req.user.id)
        .length > 0
    ) {
      // Remove
      commended.skillful = true;
      if (req.body.updateSkillful) {
        user.commendedBy.skillful = user.commendedBy.skillful.filter(
          (id) => id.toString() !== req.user.id
        );
        user.commendation.skillful -= 1;
        commended.skillful = false;
      }
    } else if (req.body.updateSkillful) {
      // Add
      user.commendedBy.skillful.push(ObjectId(req.user.id));
      user.commendation.skillful += 1;
      commended.skillful = true;
    }

    if (
      user.commendedBy.friendly.filter((id) => id.toString() === req.user.id)
        .length > 0
    ) {
      // Remove
      commended.friendly = true;
      if (req.body.updateFriendly) {
        user.commendedBy.friendly = user.commendedBy.friendly.filter(
          (id) => id.toString() !== req.user.id
        );
        user.commendation.friendly -= 1;
        commended.friendly = false;
      }
    } else if (req.body.updateFriendly) {
      // Add
      user.commendedBy.friendly.push(ObjectId(req.user.id));
      user.commendation.friendly += 1;
      commended.friendly = true;
    }

    if (
      user.commendedBy.knowledgeable.filter(
        (id) => id.toString() === req.user.id
      ).length > 0
    ) {
      // Remove
      commended.knowledgeable = true;
      if (req.body.updateKnowledgeable) {
        user.commendedBy.knowledgeable = user.commendedBy.knowledgeable.filter(
          (id) => id.toString() !== req.user.id
        );
        user.commendation.knowledgeable -= 1;
        commended.knowledgeable = false;
      }
    } else if (req.body.updateKnowledgeable) {
      // Add
      user.commendedBy.knowledgeable.push(ObjectId(req.user.id));
      user.commendation.knowledgeable += 1;
      commended.knowledgeable = true;
    }

    await user.save();

    let response = {
      skillful: user.commendation.skillful,
      friendly: user.commendation.friendly,
      knowledgeable: user.commendation.knowledgeable,
      skillCommended: commended.skillful,
      friendlyCommended: commended.friendly,
      knowledgeableCommended: commended.knowledgeable
    };

    return res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
};

const updateImage = async (req, res) => {
  try {
    // Get the image
    if (!req.file) return res.status(400).send('No image uploaded.');
    if (!isValidImage(req.file.mimetype))
      return res.status(400).send('Invalid image.');

    // update the db
    req.user.picture = {
      data: req.file.buffer,
      contentType: req.file.mimetype
    };

    const result = await req.user.save();
    // console.log(result)
    let b64 = Buffer.from(result.picture.data).toString('base64');
    return res
      .status(200)
      .send({ picture: `data:${result.picture.contentType};base64,${b64}` });
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
};

const getGames = async (req, res) => {
  try {
    if (!isValidObjectId(req.query.userID)) {
      return res.status(404).send('User not found');
    }
    const user = await UserModel.findById(req.query.userID);
    if (user == null) {
      return res.status(404).send('User not found');
    }

    const games = [];
    // Loop through games in games and add title field
    for (let i = 0; i < user.games.length; i++) {
      const game = await GameModel.findById(user.games[i].game);
      if (game == null) {
        console.log('Game not found');
        return res.status(404).send('Game not found');
      }
      games.push({
        // Need to clone to add title field
        game: user.games[i].game,
        title: game.game,
        image: game.image,
        video: game.video,
        rank: user.games[i].rank,
        hours: user.games[i].hours
      });
    }

    return res.status(200).send({ games: games });
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
};

const getMedia = async (req, res) => {
  try {
    if (!isValidObjectId(req.query.userID)) {
      return res.status(404).send('User not found');
    }
    const user = await UserModel.findById(req.query.userID);
    if (user == null) {
      return res.status(404).send('User not found');
    }
    const mediaIds = user.media; // ids

    // get the media objects
    let media = [];
    for (let i = 0; i < mediaIds.length; i++) {
      const post = await PostModel.findById(mediaIds[i]);
      if (post == null) {
        continue;
      }
      const author = await UserModel.findById(post.author);
      const game = await GameModel.findById(post.game);
      let currMedia = {
        _id: post._id,
        title: post.title,
        authorID: post.author,
        author: author.username,
        gameID: post.game,
        game: game.game,
        type: post.type,
        video: post.video,
        text: post.text
      };
      if (post.type === 'screenshot') {
        let b64 = Buffer.from(post.screenshot.data).toString('base64');
        let image = `data:${post.screenshot.contentType};base64,${b64}`;
        currMedia.screenshot = image;
      } else {
        currMedia.screenshot = post.screenshot;
      }
      media.push(currMedia);
    }
    return res.status(200).send({ media: media });
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
};

const updateRank = async (req, res) => {
  // Request: user, game, new rank
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).send('User not found');

    // Can't use findbyid since id is a seperate field from the game id in the db
    const game = user.games.find((x) => x.game == req.body.gameID);
    if (!game) return res.status(404).send('Game not found');

    game.rank = req.body.rank;
    if (req.body.rank === '') {
      game.rank = 'Not Set';
    }
    const result = await user.save();
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
};

const blockUser = async (req, res) => {
  try {
    const currUserID = `${req.user.id}`;
    const userID = `${req.body.userID}`;
    const currUser = await UserModel.findById(currUserID);
    if (!currUser) return res.status(404).send('User not found');
    const user = await UserModel.findById(userID);
    if (!user) return res.status(404).send('User not found');

    const blocked = currUser.blacklist.includes(userID);
    if (blocked) {
      await currUser.updateOne({ $pull: { blacklist: userID } });
    } else {
      await currUser.updateOne({ $push: { blacklist: userID } });
    }
    return res.status(200).send({ blocked: !blocked });
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
};

const updateHours = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).send('User not found');
    const game = user.games.find((x) => x.game == req.body.gameID);
    if (!game) return res.status(404).send('Game not found');
    let hours = parseInt(req.body.hours.toString());
    if (hours !== 0 && !hours) {
      return res.status(400).send('Invalid hours');
    }
    game.hours = parseInt(req.body.hours.toString());
    const result = await user.save();
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
};

const updateFavorite = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    // Check if already favorited
    let alreadyFav = false;
    if (
      user.games.filter((game) => game.game.toString() === req.body.gameID)
        .length > 0
    ) {
      alreadyFav = true;
    }

    let response = {};
    // If favorite + not yet favorite then add to db in users games
    if (!alreadyFav) {
      let game = { game: req.body.gameID, rank: 'Not Set', hours: 0 };
      user.games.push(game);
      response = { gameID: req.body.gameID, favorited: true };
    }
    // If unfavorite + in list then remove
    if (alreadyFav) {
      user.games = user.games.filter(
        (game) => game.game.toString() !== req.body.gameID
      );
      response = { gameID: req.body.gameID, favorited: false };
    }

    await user.save();
    return res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
};

const followUser = async (req, res) => {
  try {
    const currUserID = `${req.user.id}`;
    const userID = `${req.body.userID}`;
    const currUser = await UserModel.findById(currUserID);
    if (!currUser) return res.status(404).send('User not found');
    const user = await UserModel.findById(userID);
    if (!user) return res.status(404).send('User not found');

    const friend = currUser.friends.includes(userID);
    if (friend) {
      await currUser.updateOne({ $pull: { friends: userID } });
    } else {
      await currUser.updateOne({ $push: { friends: userID } });
    }
    return res.status(200).send({ friend: !friend });
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
};

const getUserFriends = async (req, res) => {
  try {
    const userID = `${req.query.userID}`;
    const user = await UserModel.findById(userID);
    if (!user) return res.status(404).send('User not found');

    const friends = [];
    const allFriends = await UserModel.find({ _id: { $in: user.friends } });
    for (const friend of allFriends) {
      const games = [];
      for (const game of friend.games) {
        const gameData = await GameModel.findById(game.game);
        if (gameData) games.push({ game: gameData.game, id: gameData._id });
      }

      let friendData = {
        games,
        id: friend._id,
        username: friend.username,
        description: friend.description
      };

      if (isValidImage(friend.picture.contentType)) {
        let b64 = Buffer.from(friend.picture.data).toString('base64');
        friendData.picture = `data:${friend.picture.contentType};base64,${b64}`;
      }

      friends.push(friendData);
    }
    return res.status(200).send({ friends });
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  updateUsername,
  updatePassword,
  updateDescription,
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
};
