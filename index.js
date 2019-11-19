require('dotenv').config();
const tmi = require('tmi.js');

// Define Configuration Options from .env file
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [
    process.env.CHANNEL_NAME
  ]
};

// Create an instance of the tmi.js client
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch IRC via tmi.js
client.connect();

// Message Handler (called on message receipt)
function onMessageHandler (target, context, msg, self) {
    self = (self) ? self : false;

    if (!self) {
        // Trim whitespace for sanitize
        const commandName = msg.trim();

        switch(commandName) {
            case "!pirate":
                client.say(target, 'Avast ye matey!');
                break;
            case "!slap":
                client.say(target, 'No trout slapping alowed; that $&#^ is for mIRC in the 90s!');
                break;
            case "!dice":
                const num = rollDice();
                client.say(target, `Rolling a d20... stand back!!!`);
                client.say(target, `You rolled a ${num}`);
                break;
            default:
                console.log(`* Unknown command ${commandName}`);
        }
    }

    return;
}

function rollDice () {
  const sides = 20;
  return Math.floor(Math.random() * sides) + 1;
}

function onConnectedHandler (addr, port) {
  console.log(client);
  console.log(`* Connected to ${addr}:${port}`);
}
