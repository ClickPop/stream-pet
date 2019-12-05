$(document).ready(function() {
    var text = "";

    setInterval(() => {
            $.get("/api/v1/creature/state/", (data) => {
                if (text != data.speech && data.speech.length > 0) {
                    text = data.speech;
                    $(".bubble").text(text).show(250);
                }
            });
     }, 100);
 });
