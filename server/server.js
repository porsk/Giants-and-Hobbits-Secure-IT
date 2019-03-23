var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    morgan = require('morgan');

var port = process.env.PORT || 3000,
    mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/home-security';

require('./api/models');

var app = express();

mongoose.Promise = global.Promise;
mongoose.connect(mongoUrl, { useMongoClient: true }, (error) => {
    if (error) {
        console.error('Error while trying to connect to the database.' + error.stack);
        process.exit(1);
    } else {
        console.log('Successfullys connected to the database.');
    }
});

app.use(morgan('tiny'));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log('HTTP API server is up and running.');
});

var arduino = require('./arduino/arduino');

//Connect to arduinos
arduino.establishConnection();

module.exports = app;
