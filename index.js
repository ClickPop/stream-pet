'use strict';

process.title = 'stream-pet';

// Our files
const options = require('./includes/_options.js');
const logIt = require('./includes/_logIt.js');

// Include and create instance of Express
const express = require('express');
const app = express();

// Load our instance of Twitch IRC API
const tmi = require('./includes/_tmiAPI.js');

// Register Express Routes
app.get( '/', (req, res) => res.send('You don\'t belong here') );

// Start up clients

app.listen( options.express.port, () => {
    logIt(`express: listening on port ${options.express.port}!`);
} );
