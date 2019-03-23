var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    morgan = require('morgan');

var port = process.env.PORT || 3000,
    mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/home-security';

var app = express();

mongoose.connect(mongoUrl, { useMongoClient: true }, (error) => {
    if (error) {
        console.error('Error while trying to connect to the database.' + error.stack);
        process.exit(1);
    } else {
        console.log('Successfullys connected to the database.');
    }
});

var arduino = require('./arduino/arduino');

app.use(morgan('tiny'));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log('HTTP API server is up and running.');
});

module.exports = app;
