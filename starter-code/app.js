require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const session      = require('express-session');
 const flash        = require('connect-flash');
const Swag = require('swag');
mongoose.Promise = Promise;

mongoose
  .connect('mongodb://localhost/starter-code', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

// app.use(require('node-sass-middleware')({
//   src:  path.join(__dirname, 'public'),
//   dest: path.join(__dirname, 'public'),
//   sourceMap: true
// }));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

Swag.registerHelpers(hbs);

app.use(session({
  secret: 'our-passport-local-strategy-app', 
  resave: true, 
  saveUninitialized: true
}));

require('./passport')(app);
app.use(flash());

// default value for title local
app.locals.title = 'Authentication with passport';



const index = require('./routes/index');
const auth = require('./routes/auth');
const boss = require('./routes/boss');
const users = require('./routes/users');
const courses = require('./routes/courses');

app.use('/', index);
app.use('/', auth);
app.use('/', boss);
app.use('/', users);
app.use('/', courses);

module.exports = app;
