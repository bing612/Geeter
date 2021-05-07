const Game = require('../models/game');
const Post = require('../models/posts');
const UserModel = require('../models/user');
const { getPostData } = require('./media');

const postGame = async (req, res) => {
  try {
    const game = `${req.body.game}`;
    const description = `${req.body.description}`;
    const tags = req.body.tags;
    const image = `${req.body.image}`; // url for now

    if (!game || !image)
      return res.status(401).send('Game title and image cannot be empty');

    const newGame = new Game({
      game,
      description,
      tags,
      image,
      reviews: [],
      media: [],
      video: false
    });
    await newGame.save();
    return res.status(200).send('Success');
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
};

const getAllGames = async (req, res) => {
  try {
    let search = { $regex: new RegExp(''), $options: 'i' };
    if (req.headers.search)
      search.$regex = new RegExp(`${req.headers.search}`);

    let sort = {};
    switch (req.headers.sort) {
      case 'game-ascending':
        sort = { game: 1 };
        break;
      case 'game-descending':
        sort = { game: -1 };
        break;
      case 'reviews-ascending':
        sort = { revs: 1 };
        break;
      case 'reviews-descending':
        sort = { revs: -1 };
        break;
      default:
        // by default, sort games ascending
        sort = { game: 1 };
        break;
    }

    const games = await Game.aggregate([
      {
        $project: {
          game: 1,
          description: 1,
          tags: 1,
          image: 1,
          media: 1,
          video: 1,
          reviews: 1,
          revs: {
            $cond: {
              if: { $eq: ['$reviews', {}] },
              then: { default: 0 },
              else: { $objectToArray: '$reviews' }
            }
          }
        }
      },
      { $unwind: '$revs' },
      {
        $group: {
          _id: '$_id',
          game: { $first: '$game' },
          description: { $first: '$description' },
          tags: { $first: '$tags' },
          image: { $first: '$image' },
          media: { $first: '$media' },
          video: { $first: '$video' },
          reviews: { $first: '$reviews' },
          revs: { $avg: '$revs.v' }
        }
      },
      {
        $match: {
          $or: [{ game: search }, { description: search }, { tags: search }]
        }
      }
    ])
      .collation({ locale: 'en' })
      .sort(sort);

    return res.status(200).send({ games });
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
};

const getGameDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const game = await Game.findById(id);
    const { averageRating, userRating } = calculateRatings(game.reviews, req);

    let media = [];
    for (const post of await Post.find({ _id: { $in: game.media } })) {
      let postData = await getPostData(req, post);
      if (postData) media.push(postData);
    }

    let isFavorite = false;
    if (req.isAuthenticated()) {
      const user = await UserModel.findById(req.user.id);
      // Check games list to see if the "id" is in it
      if (
        user.games.filter((game) => game.game.toString() === id).length > 0
      ) {
        isFavorite = true;
      }
    }

    return res.status(200).send({
      game: game.game,
      image: game.image,
      description: game.description,
      averageRating,
      userRating,
      favorite: isFavorite,
      media
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
};

const calculateRatings = (ratings, req) => {
  //return { averageRating: 1, userRating: 1 };
  if (!ratings) return 0;
  let total = 0;
  let sum = 0;
  let userRating = 0;
  for (const val of ratings.values()) {
    sum += val;
    total += 1;
  }
  if (req.user) {
    if (!ratings.get(`${req.user.id}`)) {
    } else {
      userRating = ratings.get(`${req.user.id}`);
    }
  }

  return {
    averageRating: sum / total,
    userRating
  };
};

const setRating = async (req, res) => {
  try {
    const id = req.body.id;
    const rating = req.body.rating;
    const game = await Game.findById(id);
    const uid = req.user.id;
    game.reviews.set(`${uid}`, rating);
    await game.save();
    return res.status(200).send('Success');
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  postGame,
  getAllGames,
  getGameDetails,
  setRating
};
