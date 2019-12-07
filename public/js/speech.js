// Connect to websocket
var socket = io.connect('http://localhost:1337');

// Display content in speech bubble when websocket sends data
socket.on('speech', (data) => {
    $(".bubble").hide();
    $(".bubble").text(data.speech).show(150);
});