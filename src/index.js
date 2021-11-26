const express = require('express');
const morgan = require('morgan');
const path = require('path');
const ejs = require('ejs');
const ejsLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
var session = require('express-session');
const app = express();
const port = 3000;
const resLocalMiddleWare = require('./app/middlewares/ResLocalMiddleWare');

const user_route = require('./routes/user');
const admin_route = require('./routes/admin');
const auth_route = require('./routes/auth');
const db = require('./config/db');

//Connect DB 
db.connect();

app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('combined'));
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());
app.use(session({
    secret: 'user',
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: null }
}));
app.use(methodOverride('_method'));

//Custom MiddleWares
app.use(resLocalMiddleWare);
app.use(function (req, res, next) {
    res.locals._session = req.session;
    next();
});
app.use(function (req, res, next) {
    res.locals._body = req.session.body;
    delete req.session.body;
    next();
});
app.use(function (req, res, next) {
    res.locals._message = req.session.message;
    delete req.session.message;
    next();
})
app.use(function (req, res, next) {
    res.locals._selectPatient = req.session.selectPatient;
    next();
});

//Setup view engine
app.use(ejsLayouts);
app.set("view engine","ejs");
app.set('views', path.join(__dirname, 'resources\\views'));

//Route
auth_route(app);
user_route(app);
admin_route(app);
  

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})