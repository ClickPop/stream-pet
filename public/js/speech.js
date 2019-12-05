$(document).ready(() => {
    console.log('test');
});

var text = "";

setInterval(() => {
        $.get("/api/v1/creature/state/", (data) => {
            if (text != data.speech) {
                text = data.speech;
                $("#speech").html(text);
            }
        });
 }, 100);