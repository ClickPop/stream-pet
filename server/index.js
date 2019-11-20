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
const tmiClient = new tmi.client(options.tmi.client);
const httpServer = http.createServer();
let websocketServer = null;
let websocketClients = [];

// Register our event handlers (defined below)
tmiClient.on('message', onMessageHandler);
tmiClient.on('connected', onConnectedHandler);
tmiClient.on('join', onJoinHandler);

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

function sendClientsMessage(message, type) {
    var obj = {
        type: type,
        data: {
            time: (new Date()).getTime(),
            text: message
        }
    };
    var json = JSON.stringify(obj);
    for (var i = 0; i < websocketClients.length; i++) {
        websocketClients[i].sendUTF(json);
    }
    logIt(`Sent clients ${type}`, obj);
}

function onConnectedHandler (addr, port) {
  logIt('Connected', `${addr}:${port}`);
}

function onJoinHandler (channel) {
  logIt('Joined', `${channel}`);
}

// Message Handler (called on message receipt)
function onMessageHandler (target, context, msg, self) {
    self = (self) ? self : false;

    if (!self) {
        // Trim whitespace for sanitize
        const command = msg.trim();
        const commandTest = /!\w+/;

        if (commandTest.test(command)) {
            logIt('Command issued', command, 'Sending to websocket clients');
            sendClientsMessage(command, 'command');
        } else {
            logIt('Unknown command', command);
        }
    }

    return;
}
