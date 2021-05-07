const bcrypt = require('bcryptjs');
const Strategy = require('passport-local').Strategy;
const User = require('../models/user');

const auth = async (username, password, done) => {
  const message = { message: 'Incorrect credentials.' };
  try {
    // get user from database
    let user = await User.findOne({ username: username });

    // username does not exist
    if (!user) return done(null, false, message);

    // check hashed password
    if (await bcrypt.compare(password, user.hash)) {
      return done(null, user);
    } else {
      return done(null, false, message);
    }
  } catch (e) {
    return done(e);
  }
};

const serialize = (user, done) => done(null, user.id);

const deserialize = async (id, done) => {
  try {
    // find user with id
    let user = await User.findById(id);
    // user does not exist
    if (!user) return done(null, false);
    // user does exist
    return done(null, user);
  } catch (e) {
    return done(e);
  }
};

const initialize = (passport) => {
  const fields = {
    usernameField: 'username',
    passwordField: 'password'
  };
  passport.use(new Strategy(fields, auth));
  passport.serializeUser(serialize);
  passport.deserializeUser(deserialize);
};

module.exports = initialize;
