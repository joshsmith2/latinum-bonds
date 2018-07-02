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

    var noun = function(min_length){
        out_noun = '';
        if (min_length != null) {
            while (out_noun = '') {
                candidate = get_random(nouns, 2273);
                if (candidate.length > 8) {
                    out_noun = candidate;
                }
            }
        } else {
            out_noun = get_random(nouns, 2273);
        }
        return out_noun;
    };

    var a_noun = function(){
        return articles.articlize(noun());
    };

    var an_adj = function(){
        return articles.articlize(adj());
    };

    var generate_message = function(){
        var normal_sentences = [
                "Latitude is " + an_adj() + " " + noun() + ".",
                "You are " + an_adj() + " " + adj() + " " + noun() + ".",
                "Performing on the main stage: " + capital(adj()) + " " + capital(noun()) + ".",
                "This " + noun() + " tastes oddly like " + an_adj() + " " + noun() + ".",
                "We'll make " + a_noun() + " out of you yet.",
                "Are we Human? Or are we " + capital(noun()) + "?"
        ];

        var band_names = [
            "Noah and the " + capital(noun()) + ".",
            "alt-" + noun() + ".",
            "Aphex " + capital(noun()) + ".",
            "Hedwig and the " + capital(adj()) + " " + capital(noun()),
            capital(adj()) + " " + capital(noun()) + ".",
            capital(an_adj()) + " " + capital(noun()) + ".",
            noun().toUpperCase() + "!",
            capital(adj()) + " Lewis and the " + capital(noun()) + ".",
            capital(noun()) + "-Yards.",
            noun().replace(/[aeiou]/g, '')
        ];

        var sentences = band_names;

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
    var best_message = '';
    var best_score = 0;
    var best_head = "";
    var best_tail = "";

    $(document).keypress(function(){

        human_message = latinum.generate_message();

        msg = sha256.x2(human_message);
        score = latinum.count_trailing_zeroes(msg);
        var head = msg.substr(0,64-score);
        var tail = msg.substr(-score,score);

        if (score >= best_score) {
            best_score = score;
            best_message = human_message;
            best_head = head;
            best_tail = tail;
        }

        $('#latest-message').text(human_message);
        $('#latest-hash .head').text(head);
        $("#latest-hash .tail").text(tail);
        $(".score#last").text(score);

        $('#best-message').text(best_message);
        $('#best-hash .head').text(best_head);
        $("#best-hash .tail").text(best_tail);
        $(".score#best").text(best_score);
    });
});
