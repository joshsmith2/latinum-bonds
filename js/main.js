var sha256 = require('sha256');
var randomWords = require('random-words');

window.latinum= {};

$(function(){
    var generate_message = function(){
        var words = randomWords({exactly: 2});
        var vowelish = ['a','e','i','o','u','y','s'];
        var sentence = "";
        if (words[1].substr(-1,1) == "s"){
            sentence = "You're all a bunch of " + words[0] + ' ' + words[1] + '.';
        } else if (vowelish.includes(words[0].substr(-1,1)))  {
            sentence = "Latitude is a place for " + words[0] + " " + words[1] + ".";
        } else {
            var suffix = "ing";
            if (words[0].substr(-3,3) == 'ing'){
                suffix = ""
            }
            sentence = "You're really " + words[0] + suffix + " my " + words[1] + ".";
        }
        return sentence;
    };


    var count_trailing_zeroes = function(hash){
        var zeroes = 0;
        hash =  $.trim(hash);
        for (var i=1; i <= hash.length; i++){
            if (hash.substr(-i,1) !== '0'){
                zeroes = i-1;
                return zeroes
            }
        }
    };

    latinum.generate_message = generate_message;
    latinum.count_trailing_zeroes = count_trailing_zeroes;
});

$(document).ready(function() {

    var msg;
    var human_message;
    $(document).keypress(function(){
        human_message = latinum.generate_message();
        msg = sha256.x2(human_message);
        $('#human').text(human_message);
        $("#message").text(msg);
        $("#ze-2").text(latinum.count_trailing_zeroes(msg));
    });
});
