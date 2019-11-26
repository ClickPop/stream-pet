const tmi = require('tmi.js');
const options = require('./_options.js');
const logIt = require('./_logIt.js');

const tmiAPI = new tmi.client(options.tmi.client);

// Global objects for tracking active users based on chat activity
let activeUser = {};
let activeTimeout;
const timeout = 1000 * 60 * 5;

// Function to greet a user when the send the first message in the chat and start a timeout timer
function greet (target, user) {
    const username = user.username;
    logIt(`Greet Triggered with username: ${username}`);
    tmiAPI.say(target,`Greetings ${username}, welcome to the channel`);
    activeUser[username] = true;
    activeTimeout = setTimeout (timeoutFunc, timeout, username);
}

// Function to reset the status of a user based on chat activity
function timeoutFunc (name) {
    activeUser[name] = false;
    logIt(`${name} timed out`);
}


// EVENT: Message Received
tmiAPI.on('message', (target, context, msg, self) => {
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
                        tmiAPI.say(target, `/me ${context["display-name"]} says: ${speech}`);
                    }
                    break;
                case (diceTest.test(command)):
                    let dice = command.match(diceTest);
                    let diceSides = parseInt(dice[1], 10);
                    if (!isNaN(diceSides)) {
                        let diceResult = (Math.floor(Math.random() * diceSides) + 1);
                        tmiAPI.say(target, `/me Rolling a d${diceSides}... it's a ${diceResult}`);
                    }
                    break;
            }
        }
    }

    return;
});

// EVENT: Connected to Twitch IRC server event
tmiAPI.on('connected', (addr, port) => {
    logIt(`tmi.js: Connected to ${addr}:${port}`)
});

// EVENT: User joined Twitch IRC channel
tmiAPI.on('join', (channel, username) => {
    logIt(`tmi.js: ${username} joined ${channel}`);
});

// Initialize Twitch IRC Connection via tmi.js
tmiAPI.connect();

// Pass tmiAPI as module
module.exports = tmiAPI;
