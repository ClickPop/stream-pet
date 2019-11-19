'use strict';

process.title = '${process.env.PACKAGE}-service';

// Third-Party Libraries
require('dotenv').config();
const http = require('http');
const websocket = require('websocket');
const tmi = require('tmi.js');

// Our files
const logIt = require('./lib/logIt.js');
const options = require('./config/options.js');

// Create an instance of the tmi.js client
const tmiClient = new tmi.client(options.tmi);
const httpServer = http.createServer();
let websocketServer = null;
let websocketClients = [];

// Register our event handlers (defined below)
tmiClient.on('message', onMessageHandler);
tmiClient.on('connected', onConnectedHandler);

// Connect to Twitch IRC via tmi.js
tmiClient.connect();
httpServer.listen(options.websocket.port, function() {
    logIt(`HTTP server listening on port ${options.websocket.port}`);
});
websocketServer = new websocket.server({
    httpServer: httpServer,
    autoAcceptConnections: false
});

// This callback is called every time someone tries to connect to the Websocket
websocketServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      logIt('Connection rejected', request.origin);
      return;
    }
    var connection = request.accept('echo-protocol', request.origin);
    var index = websocketClients.push(connection) - 1;

    logIt('Connection accepted', request.origin);

    connection.on('message', function(message) {
        if (message.type !== 'utf8') {
            logIt('Message Rejected', 'Only UTF8 messages accepted');
            return;
        } else if (message.type === 'utf8') {
            var obj = JSON.stringify({
                type: 'message',
                data: {
                    time: (new Date()).getTime(),
                    text: message.utf8Data
                }
            });
            for (var i = 0; i < websocketClients.length; i++) {
                websocketClients[i].sendUTF(obj);
            }
        }
    });

    connection.on('close', function(connection) {
        logIt('Peer disconnected', connection.remoteAddress);

        // remove from list of clients
        websocketClients.splice(index, 1);
    });
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

// Message Handler (called on message receipt)
function onMessageHandler (target, context, msg, self) {
    self = (self) ? self : false;

    if (!self) {
        // Trim whitespace for sanitize
        const commandName = msg.trim();

        switch(commandName) {
            case "!pirate":
                tmiClient.say(target, 'Avast ye matey!');
                break;
            case "!slap":
                tmiClient.say(target, 'No trout slapping alowed; that $&#^ is for mIRC in the 90s!');
                break;
            case "!dice":
                const num = rollDice();
                tmiClient.say(target, `Rolling a d20... stand back!!!`);
                tmiClient.say(target, `You rolled a ${num}`);
                break;
            default:
                logIt('Unknown command', commandName);
        }
    }

    return;
}

function rollDice () {
  const sides = 20;
  return Math.floor(Math.random() * sides) + 1;
}

function onConnectedHandler (addr, port) {
  logIt('Connected', `${addr}:${port}`);
}
