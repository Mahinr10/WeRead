const express = require('express');
const session = require('express-session');

const app = express();
const PORT = 4000;

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(session({
    secret:"Defence",
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge:3000000
    }
}))

app.set('view engine', 'ejs');
app.use('/', require('./controller.js'));
app.use('/static', express.static('public'));

app.listen(PORT);