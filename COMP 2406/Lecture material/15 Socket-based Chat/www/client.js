$(document).ready(function() {
    const userName = prompt("What's your name?") || "User";
    const socket = io(); //connect to the server that sent this page

    socket.on("connect", function() {
        socket.emit("intro", userName);
    });

    $("#inputText").keypress(function(ev) {
        if (ev.which === 13) {
            //send message
            socket.emit("message", $(this).val());
            ev.preventDefault(); //if any
            $("#chatLog").append((new Date()).toLocaleTimeString() + ", " + userName + ": " + $(this).val() + "\n");
            $(this).val(""); //empty the input
        }
    });

    socket.on("message", function(data) {
        $("#chatLog").append(data + "\n");
        $("#chatLog")[0].scrollTop = $("#chatLog")[0].scrollHeight; //scroll to the bottom
    });

    socket.on("userList", function(currUsers) {
        $("#userList").empty(); //empty list for ease of update
        currUsers.forEach(function(user) { //simple for loop -> go through each user with socket
            const element = $('<li>' + user + '</li>'); // create list item
            $("#userList").append(element); //then add list item
        });
    });
});
