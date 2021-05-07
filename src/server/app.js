// package docs can be found at https://www.npmjs.com/package/<package-name>
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');
const passport = require('passport');

// create express app
const app = express();

// trust first proxy
app.set('trust proxy', 1);

// enable express body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set up express session
const dbconn = require('./config/database');
app.use(
  session({
    secret: process.env.SESS_SECRET,
    saveUninitialized: true,
    resave: false,
    store: new MongoStore({ mongooseConnection: dbconn }),
    cookie: {
      secure: process.env.DEBUG ? false : true,
      maxAge: 1000 * 60 * 60 * 24 // 1 day in milliseconds
    }
  })
);

// enable Cross Origin Resource Sharing
app.use(
  cors({
    origin: process.env.APP_URL,
    methods: 'GET,POST,DELETE',
    optionsSuccessStatus: 200,
    credentials: true
  })
);

// configure and use passport
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// use our custom routes
app.use(require('./routes/index'));

app.listen(process.env.PORT, () => {
  console.log(`App listening at http://localhost:${process.env.PORT} !`);
});
