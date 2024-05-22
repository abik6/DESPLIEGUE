const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const nunjucks = require('nunjucks');
const methodOverride = require('method-override');

const recetas = require(__dirname + '/routes/recetas');
const auth = require(__dirname + '/routes/auth');

mongoose.connect('mongodb://127.0.0.1:27017/recetas');

let app = express();

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.set('view engine', 'njk');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: '1234',
    resave: true,
    saveUninitialized: false
}));
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
}));
app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

app.use('/recetas', recetas);
app.use('/auth', auth);


app.get('/', (req, res) => {
    res.redirect('/recetas');
});

app.listen(8080);
