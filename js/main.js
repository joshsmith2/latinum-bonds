var sha256 = require('sha256');
var articles = require('articles');

window.latinum= {};

$(function(){
    var capital = function(word){
        var lw = word.length;
        return word.substr(0,1).toUpperCase() + word.substr(1,lw);
    };

    var get_random = function(array, len){
        return array[Math.floor(Math.random() * len)];
    };

    var adj = function(){
       return get_random(adjectives, 5176);
    };

    var noun = function(){
        return get_random(nouns, 2273);
    };

    var a_noun = function(){
        return articles.articlize(noun());
    };

    var an_adj = function(){
        return articles.articlize(adj());
    };

    var generate_message = function(){
        var sentences = ["Latitude is " + an_adj() + " " + noun() + ".",
                         "You are " + an_adj() + " " + adj() + " " + noun() + ".",
                         "Performing on the main stage: " + capital(adj()) + " " + capital(noun()) + ".",
                         "This " + noun() + " tastes oddly like " + an_adj() + " " + noun() + ".",
                         "We'll make " + a_noun() + " out of you yet.",
                         "Are we Human? Or are we " + capital(noun()) + "?"];
        return get_random(sentences, sentences.length);
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
