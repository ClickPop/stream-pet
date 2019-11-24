$(function () {
    "use strict";

    var $log = $('.websocket-log');
    var $content = $('.app');
    var connection = null;


    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    // if browser doesn't support WebSocket, just show
    // some notification and exit
    if (!window.WebSocket) {
        $content.html($('<p>', {
            text:'Sorry, but your browser doesn\'t support WebSocket.',
            class: 'error' } ));
            return;
    }
    logMessage('Connecting...', $log, 'alert');

    connection = new WebSocket('ws://127.0.0.1:1337', 'echo-protocol');
    connection.onopen = function () {
        $log.empty();
        logMessage('Connected to webscoket', $log, 'success');
    };
    connection.onerror = function (error) {
        // just in there were some problems with connection...
        $content.html($('<p>', {
            text: 'Sorry, but there\'s some problem with your '
            + 'connection or the server is down.',
            class: 'error'
        }));
    };
    connection.onmessage = function(message) {
        try {
            var json = JSON.parse(message.data);
            console.log(json);
        } catch (e) {
            logMessage('Invalid JSON', $log, 'alert');
            return;
        }

        if (json.hasOwnProperty('type') && json.type === 'command') {
            if (json.hasOwnProperty('data') && typeof json.data === 'object') {
                sendMessageToLog(json.data, $log);
            } else {
                logMessage('Data object not received', $log, 'alert');
            }
        } else {
            logMessage('Invalid data type received', $log, 'alert');
        }
    };
    setInterval(function() {
        if (connection.readyState !== 1) {
            logMessage('Unable to connect to websocket... retrying', $log, 'error');
        }
    }, 3000);
});
function sendMessageToLog(data, $log) {
    console.log(data, $log);
    if (data.hasOwnProperty('text') && data.hasOwnProperty('time')) {
        var msg = data.text + ' <span class="meta">(' + niceTime(data.time) + ')</span>'
        logMessage(msg, $log);
    }
}
function logMessage(msg, $log, classes = 'normal') {
    classes = typeof classes === 'string' ? classes : 'normal';
    $log.empty();
    $('<li>', { html: msg, class: classes }).appendTo($log);
}

function niceTime(timestamp) {
    dt = new Date(timestamp);
    rVal = (dt.getHours() < 10) ?
        '0' + dt.getHours() : dt.getHours();
    rVal += ':';
    rVal += (dt.getMinutes() < 10) ?
        '0' + dt.getMinutes() : dt.getMinutes();

    return rVal;
}
