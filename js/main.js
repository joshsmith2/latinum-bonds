var sha256 = require('sha256');
var articles = require('articles');

window.latinum= {};
latinum.score = 0;

$(function(){

    var msg;
    var human_message;
    var best_message = '';
    var best_score = 0;
    var best_head = "";
    var best_tail = "";

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

    var nn = function (){
        return get_random(nouns, 905).replace(/[aeiou]/g, '');
    };

    var a_noun = function(){
        return articles.articlize(noun());
    };

    var double_noun = function(){
        var n = capital(noun());
        return n + " " + n;
    };

    var double_name = function(){
        var n = capital(name());
        return n + " " + n;
    };

    var an_adj = function(){
        return articles.articlize(adj());
    };

    var monetise = function(word){
        return word.replace('s','$').replace('e','€')
    };

    var name = function(){
        return capital(get_random(names, 5163));
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
            nn(),
            name() + " and the " + capital(noun()),
            name() + " " + name() + " and the " + capital(adj()) + " " + capital(noun()) + " band",
            "alt-" + noun(),
            "Aphex " + capital(noun()),
            name() + " and the " + capital(adj()) + " " + capital(noun()),
            capital(adj()) + " " + capital(noun()),
            noun().toUpperCase() + "!",
            capital(adj()) + " Lewis and the " + capital(noun()),
            capital(noun()) + "selektor",
            capital(adj()) + " Heart",
            "Lil " + capital(noun()),
            "Lil " + name(),
            "A$AP " + capital(monetise(noun())),
            "DJ " + capital(noun()),
            "MC " + capital(noun()),
            capital(noun()) + " feat. MC " + capital(noun()),
            "DJ " + name() + " and MC " + name(),
            name(),
            capital(adj()) + " " + name(),
            name() + " " + capital(noun()),
            "The artist formerly known as " + capital(noun()),
            "Godspeed you " + capital(adj()) + " " + capital(noun()),
            double_noun(),
            double_name(),
            "The " + capital(noun()) + " orchestra",
            "The " + capital(adj()) + " orchestra"
        ];

        var sentences = band_names;

        return get_random(sentences, sentences.length);
    };

    var run_generator = function() {
        human_message = latinum.generate_message();

        msg = sha256.x2(human_message);
        latinum.score = latinum.count_trailing_zeroes(msg);

        var head = msg.substr(0, 64-latinum.score);
        var tail = msg.substr(-latinum.score, latinum.score);

        if (latinum.score >= best_score) {
            best_score = latinum.score;
            best_message = human_message;
            best_head = head;
            best_tail = tail;
        }

        $('#latest-message').text(human_message);
        $('#latest-hash .head').text(head);
        $("#latest-hash .tail").text(tail);
        $(".score#last").text(latinum.score);

        $('#best-message').text(best_message);
        $('#best-hash .head').text(best_head);
        $("#best-hash .tail").text(best_tail);
        $(".score#best").text(best_score);
    };

    var run_until_target = function(target) {
        target = typeof target !== 'undefined' ? target : 4;
        count = 0;
        while (count < target) {
            run_generator();
            count = latinum.score;
        }
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
    latinum.run_until_target = run_until_target;
    latinum.run_generator = run_generator;
});

$(document).ready(function() {
    $(document).keypress(function(){
        latinum.run_generator();
    });
});
