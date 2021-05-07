const mongoose = require('mongoose');
const { Schema } = mongoose;

const GameSchema = new Schema({
  game: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  tags: {
    type: [String]
  },
  image: {
    type: String,
    required: true
  },
  reviews: {
    type: Map,
    of: Number
  },
  media: {
    type: [Schema.Types.ObjectID]
  },
  video: {
    type: Boolean
  }
});

const GameModel = mongoose.model('Game', GameSchema);

module.exports = GameModel;
