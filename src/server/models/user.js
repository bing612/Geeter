const mongoose = require('mongoose');
const validator = require('validator');
const { Schema } = mongoose;

// define table schema
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
    validate: {
      validator: validator.isEmail,
      message: 'Not valid email'
    }
  },
  hash: { type: String, required: true },
  picture: { data: Buffer, contentType: String },
  description: { type: String, default: '' },
  commendation: {
    skillful: { type: Number, default: 0 },
    friendly: { type: Number, default: 0 },
    knowledgeable: { type: Number, default: 0 }
  },
  commendedBy: {
    skillful: [Schema.Types.ObjectID],
    friendly: [Schema.Types.ObjectID],
    knowledgeable: [Schema.Types.ObjectID]
  },
  games: [
    {
      game: { type: Schema.Types.ObjectID, required: true },
      rank: { type: String, default: 'N/A' },
      hours: { type: Number, default: 0 }
    }
  ],
  media: [Schema.Types.ObjectID],
  friends: [Schema.Types.ObjectID],
  blacklist: [Schema.Types.ObjectID]
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
