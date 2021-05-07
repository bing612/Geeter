const mongoose = require('mongoose');
const { Schema } = mongoose;

// define table schema
const QueueSchema = new Schema({
  game: {
    type: Schema.Types.ObjectID,
    required: true
  },
  user: {
    type: Schema.Types.ObjectID,
    required: true,
    unique: true
  }
});

QueueSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 2 });

const QueueModel = mongoose.model('Queue', QueueSchema);

module.exports = QueueModel;
