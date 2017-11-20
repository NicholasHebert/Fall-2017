$(document).ready(function() {
    const socket = io('http://localhost:3000');
    $("#inputText").keypress(function(ev) { //listener to send messages to the chatLog
        if (ev.which === 13) {
            if ($(this).val() != "") {
                //send message
                socket.emit("message", $(this).val());
                ev.preventDefault(); //if any
                $(this).val(""); //empty the input
            }
        }
    });
    socket.on("food", function(data){

    });
});
