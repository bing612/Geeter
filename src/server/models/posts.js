const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    // user id
    type: Schema.Types.ObjectID,
    required: true
  },
  game: {
    // game id
    type: Schema.Types.ObjectID,
    required: true
  },
  created: {
    // date + time created
    type: Date,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [Schema.Types.ObjectID],
  type: {
    // screenshot, video, or text
    type: String,
    required: true
  },
  // When using the db first check type then extract one the the below.
  // If sending anything over the server's api then only send one of the below.
  screenshot: {
    // An image
    data: Buffer,
    contentType: String
  },
  video: {
    // A url to a video on youtube
    type: String,
    trim: true
  },
  text: {
    // String of text
    type: String
  },
  tags: [String]
});

const PostModel = mongoose.model('Post', PostSchema);

module.exports = PostModel;
