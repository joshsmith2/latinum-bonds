var sha256 = require('sha256');
var randomWords = require('random-words');

window.latinum= {};

$(function(){
    var generate_message = function(){
        words = randomWords({exactly: 2});
        return "You're really " + words[0] + "ing my " + words[1] + "."
    };

    latinum.generate_message = generate_message;

});

$(document).ready(function() {

    var msg;
    var human_message;

    human_message = latinum.generate_message();

    msg = sha256.x2(human_message);

    $('#human').text(human_message);
    $("#message").text(msg);

});
