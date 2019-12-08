// Connect to websocket
var socket = io.connect('http://localhost:1337');

socket.on('connect', () => {
    console.log(socket.id, 'connected');
});

// Display content in speech bubble when websocket sends data
socket.on('talk', (data) => {
    $(".bubble").text(data.username + ' says: ' + data.speech).show(150);
    setTimeout(() => {
        $(".bubble").text('');
        $(".bubble").hide(150);
    }, 5000)
    console.log(data);
});

socket.on('dice', (data) => {

    $(".bubble").text('You rolled a ' + data.result + ' on your D' + data.sides).show(150);
    setTimeout(() => {
        $(".bubble").text('');
        $(".bubble").hide(150);
    }, 5000)
    console.log(data);
});

socket.on('greet', (data) => {
    $(".bubble").text('Welcome ' + data.user).show(150);
    setTimeout(() => {
        $(".bubble").text('');
        $(".bubble").hide(150);
    }, 5000)
    console.log(data);
});

socket.on('dance', (data) => {
    $(".bubble").hide();
    $(".fett").css("background-image", "url(../images/cuteslime.gif)");
    setTimeout(() => {
        $(".fett").css("background-image", "url(../images/boba-fett.gif)");
    }, 3500);
    console.log(data);
});