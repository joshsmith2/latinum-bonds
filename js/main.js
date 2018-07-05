var sha256 = require('sha256');
var articles = require('articles');
var pluralize = require('pluralize');

window.latinum= {};
latinum.score = 0;
latinum.roller = '';
latinum.running = false;
latinum.stop_at = 2;

$(function(){

    var msg;
    var human_message;
    var best_message = '';
    var best_score = 1;
    var best_head = "";
    var best_tail = "";
    var messages = [];


    function two_level_sort(a, b) {
      var score1 = a.score;
      var score2 = b.score;

      var message1 = a.message.toLowerCase();
      var message2 = b.message.toLowerCase();

      if (score1 < score2) return -1;
      if (score1 > score2) return 1;
      if (message1 < message2) return -1;
      if (message1 > message2) return 1;
      return 0;
    }

    var add_to_message_list = function(msg, scr) {
        messages.push({message: msg, score: scr});
        for (i = 0; i < messages.length; i++){
            console.log(messages[i].message);
            $("#winner-" + i + " .message").text(messages[i].message);
            $("#winner-" + i + " .score").text(messages[i].score);
            $("#winner-" + i + " .score").addClass('green');
        }
    };

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
        return get_random(latinum_nouns, 2273);
    };

    var nn = function (){
        return get_random(latinum_nouns, 905).replace(/[aeiou]/g, '');
    };

    var a_noun = function(cap){
        if (cap === 'c') {
            out = articles.articlize(capital(noun()));
        } else {
            out = articles.articlize(noun());
        }
        return out;
    };

    var nouns = function() {
        var the_noun = noun();
        return pluralize(the_noun, 2);
    };

    var double_noun = function(){
        var n = capital(noun());
        return n + " " + n;
    };

    var multi_nouns = function(){
        var n = capital(nouns());
        return n + "! " + n + "! " + n + "!"
    };

    var double_name = function(){
        var n = capital(name());
        return n + " " + n;
    };

    var an_adj = function(){
        return articles.articlize(adj());
    };

    var monetise = function(word){
        return word.replace('s','$').replace('e','€');
    };

    var name = function(){
        return capital(get_random(names, 5163));
    };

    var generate_message = function(){

        var band_names = [
            nn(),
            name() + " and the " + capital(noun()),
            name() + " and the " + capital(nouns()),
            name() + " " + name() + " and the " + capital(adj()) + " " + capital(noun()) + " Band",
            name() + " " + name() + " & the " + capital(adj()) + " " + capital(nouns()),
            "alt-" + noun(),
            "Aphex " + capital(noun()),
            name() + " and the " + capital(adj()) + " " + capital(nouns()),
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
            name() + " " + capital(nouns()),
            "The Artist formerly known as " + capital(noun()),
            "Godspeed! You " + capital(adj()) + " " + capital(noun()),
            double_noun(),
            double_name(),
            "The " + capital(noun()) + " Orchestra",
            "The " + capital(adj()) + " Orchestra",
            "Mega" + noun(),
            capital(noun()) + "ica",
            "The " + capital(nouns()),
            "The " + capital(adj()) + " " + capital(nouns()),
            "...And you will know us by the Trail of " + capital(nouns()),
            "The " + capital(noun()) + " Quartet",
            "The " + capital(noun()) + " Fighters",
            "The " + capital(noun()) +  " " + capital(nouns()),
            name() + " and " + name() + " Play The Hits",
            name() + " is " + capital(a_noun('c')),
            name() + " " + name() + "-" + capital(noun()),
            capital(adj()) + " B",
            capital(noun()) + " D",
            capital(noun()) + " B2B " + capital(adj()) + " " + capital(noun()),
            multi_nouns(),
            capital(noun()) + "pusher",
            a_noun("c") + " called " + name(),
            capital(noun()) + "song",
            capital(noun()) + " Problems",
            name() + "'s Big " + capital(nouns()),
            name() + "'s " + capital(adj()) + " " + capital(nouns()),
            capital(adj()) + " " + capital(noun()) + " Soundsystem",
            name() + "'s only " + capital(noun()),
            name() + " Mc" + name(),
            name() + " Mc" + capital(adj()),
            capital(adj()) +  " " + capital(noun()) + " " + capital(nouns()),
            "The " + capital(noun()) + "-" + capital(noun()) + " Clan",
            "Ol' " + capital(adj()) + " " + capital(noun()),
            "Ol' " + capital(adj()) + " " + name(),
        ];

        var sentences = band_names;
        return get_random(sentences, sentences.length);
    };

    var run_generator = function() {
        human_message = latinum.generate_message();
        msg = sha256.x2(human_message);
        latinum.score = latinum.count_trailing_zeroes(msg);

        var head = msg.substr(0, latinum.score);
        var tail = msg.substr(latinum.score, 64);

        if (latinum.score >= latinum.stop_at) {
            add_to_message_list(human_message, latinum.score);
            window.clearInterval(latinum.roller);
            latinum.running = false;
            var last_score = $(".score#last");
            last_score.removeClass('grey');
            last_score.addClass('green');
        } else {
            var last_score = $(".score#last");
            last_score.removeClass('green');
            last_score.addClass('grey');
        }
        if (latinum.score >= best_score) {
            best_score = latinum.score;
            best_message = human_message;
            best_head = head;
            best_tail = tail;

            $('#best-message').text(best_message);
            $('#best-hash .head').text(best_head);
            $("#best-hash .tail").text(best_tail);
            $(".score#best").text(best_score);
        }

        $('#latest-message').text(human_message);
        $('#latest-hash .head').text(head);
        $("#latest-hash .tail").text(tail);
        last_score.text(latinum.score);

    };

    var count_leading_zeroes = function(hash){
        var zeroes = 0;
        hash =  $.trim(hash);
        for (var i=0; i <= hash.length; i++){
            if (hash.substr(i,1) !== '0'){
                zeroes = i;
                return zeroes
            }
        }
    };

    latinum.generate_message = generate_message;
    latinum.count_trailing_zeroes = count_leading_zeroes;
    latinum.run_generator = run_generator;
});

$(document).ready(function() {
    $(document).keypress(function(){
        if (!latinum.running) {
            latinum.roller = window.setInterval(latinum.run_generator, 1);
            latinum.running = true;
        }
    });
});
