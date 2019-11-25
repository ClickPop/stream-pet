'use strict';

process.title = '${process.env.PACKAGE}';

// Third-Party Libraries
require('dotenv').config();
const http = require('http');
const tmi = require('tmi.js');

// Our files
const logIt = require('./includes/_logIt.js');
const options = require('./includes/_options.js');

// Create an instance of the tmi.js client
const tmiClient = new tmi.client(options.tmi.client);
const httpServer = http.createServer();

// Register our event handlers (defined below)
tmiClient.on('message', onMessageHandler);
tmiClient.on('connected', onConnectedHandler);
tmiClient.on('join', onJoinHandler);

// Global objects for tracking active users based on chat activity
var activeUser = {};
var activeTimeout;
const timeout = 1000 * 60 * 5;

// Connect to Twitch IRC via tmi.js
tmiClient.connect();
httpServer.listen(options.express.port, function() {
    logIt(`http: listening on port ${options.express.port}!`);
});

function onConnectedHandler (addr, port) {
  logIt(`tmi.js: Connected to ${addr}:${port}`);
}

function onJoinHandler (channel, username) {
  logIt(`tmi.js: ${username} joined ${channel}`);
}

// Message Handler (called on message receipt)
function onMessageHandler (target, context, msg, self) {
    self = (self) ? self : false;

    if (!self) {
        // Trim whitespace for sanitize
        const command = msg.trim();

        // Regex Tests
        const commandTest = /^!\w+/;
        const diceTest = /^!d(\d+)$/i;

        // Get username from message context
        let username = context.username;

        //checks to see if this is the first message from the user
        if (!(username in activeUser) || activeUser[username] === false) {
            greet(target, context);
        } else {
            activeUser[username] = true;
            clearTimeout(activeTimeout);
            activeTimeout = setTimeout (timeoutFunc, timeout, username);
        }

        if (commandTest.test(command)) {
            logIt(`tmi.js: Command issued ${command}`);
            switch (true) {
                case (command.startsWith('!talk')):
                    console.log("talk");
                    let speech = command.substring(6, command.length);
                    speech = speech.trim();
                    if (speech.length > 0) {
                        tmiClient.say(target, `/me ${context["display-name"]} says: ${speech}`);
                    }
                    break;
                case (diceTest.test(command)):
                    let dice = command.match(diceTest);
                    let diceSides = parseInt(dice[1], 10);
                    if (!isNaN(diceSides)) {
                        let diceResult = (Math.floor(Math.random() * diceSides) + 1);
                        tmiClient.say(target, `/me Rolling a d${diceSides}... it's a ${diceResult}`);
                    }
                    break;
            }
        }
    }

    return;
}

// Function to greet a user when the send the first message in the chat and start a timeout timer
function greet (target, user) {
    const username = user.username;
    logIt(`Greet Triggered with username: ${username}`);
    tmiClient.say(target,`Greetings ${username}, welcome to the channel`);
    activeUser[username] = true;
    activeTimeout = setTimeout (timeoutFunc, timeout, username);
}

// Function to reset the status of a user based on chat activity
function timeoutFunc (name) {
    activeUser[name] = false;
    logIt(`${name} timed out`);
}
