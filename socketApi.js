var socket_io = require('socket.io');
var io = socket_io();
var socketApi = {};

socketApi.io = io;

var animationStateData = {};

const tmi = require('./includes/_tmiAPI.js');

io.on('connection', (socket) => {
    console.log('New connection with ID:', socket.id);

    const animationStateUpdater = () => {
        let data = tmi.getCurrentState();
        if (data !== animationStateData) {
            animationStateData = data;
            console.log(animationStateData, 'on web socket', socket.id);
            if (typeof animationStateData.command !== "undefined") {
                io.emit(animationStateData.command, animationStateData);
            }
        }
        setTimeout(animationStateUpdater, 100);
    }; animationStateUpdater();    
});

module.exports = socketApi;