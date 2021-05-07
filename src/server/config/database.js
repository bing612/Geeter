const mongoose = require('mongoose');

// default settings at https://www.npmjs.com/package/mongoose
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

const database = mongoose.connection;

database.on('error', (err) => console.log(`db error: ${err.message}`));

module.exports = database;
