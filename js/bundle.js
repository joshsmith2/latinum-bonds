(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var sha256 = require('sha256');
var articles = require('articles');
var pluralize = require('pluralize');

window.latinum= {};
latinum.score = 0;
latinum.roller = '';
latinum.running = false;
latinum.finished = false;
latinum.stop_at = 2;
latinum.messages = [];

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

    var end_this_go = function(){
        latinum.finished = true;
        var time_taken = new Date - latinum.start_time;
        var expected_multiple = latinum.hashcount * Math.pow(16,12);
        var expected_time = time_taken * expected_multiple;
        var years_taken = Math.round(expected_time / 31536000000);
        $("#years").text(years_taken.toLocaleString('en'));
        $("#hashcount").text(latinum.hashcount);
        $('#final-message').toggleClass('hidden');
        $('#normal-message').toggleClass('hidden');
    };

    var update_lineup = function(){
        messages = latinum.messages;
        for (i = 0; i < messages.length; i++){
            $("#winner-" + i + " .message").text(messages[i].message);
            $("#winner-" + i + " .score").text(messages[i].score);
            $("#winner-" + i + " .score").addClass('green');
        }
    };

    var clear_lineup = function(){
        for (i = 0; i < messages.length; i++){
            $("#winner-" + i + " .message").text('');
            $("#winner-" + i + " .score").text('');
            $("#winner-" + i + " .score").removeClass('green');
        }
    };

    var add_to_message_list = function(msg, scr) {
        latinum.messages.push({message: msg, score: scr});
        update_lineup();
        if (messages.length === 12) {
            end_this_go();
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
            "The " + capital(nouns()),
            "The " + capital(nouns()),
            "The " + capital(adj()) + " " + capital(nouns()),
            "...And you will know us by the Trail of " + capital(nouns()),
            "The " + capital(noun()) + " Quartet",
            "The " + capital(noun()) + " Fighters",
            "The " + capital(noun()) +  " " + capital(nouns()),
            name() + " and " + name() + " Play The Hits",
            name() + " is " + a_noun('c'),
            name() + " " + name() + "-" + capital(noun()),
            capital(adj()) + " B",
            capital(noun()) + " D",
            capital(noun()) + " B2B " + capital(adj()) + " " + capital(noun()),
            multi_nouns(),
            capital(noun()) + "pusher",
            capital(a_noun("c")) + " called " + name(),
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
        latinum.hashcount += 1;
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

    var reset = function(){
        latinum.start_time = new Date;
        latinum.hashcount = 0;
        latinum.finished = false;
        $('#final-message').toggleClass('hidden');
        $('#normal-message').toggleClass('hidden');
        latinum.messages = [];
        clear_lineup();
    };

    latinum.generate_message = generate_message;
    latinum.count_trailing_zeroes = count_leading_zeroes;
    latinum.run_generator = run_generator;
    latinum.reset = reset;
});

$(document).ready(function() {
    latinum.start_time = new Date;
    latinum.hashcount = 0;
    $(document).keypress(function( event ){
        if (!latinum.finished) {
            if (!latinum.running) {
                latinum.roller = window.setInterval(latinum.run_generator, 1);
                latinum.running = true;
                return false;
            }
        } else {
            if (event.key === 'c') {
                latinum.reset();
                return false;
            } else {
                return false;
            }
        }
    });
});

},{"articles":2,"pluralize":5,"sha256":6}],2:[function(require,module,exports){
// Generated by CoffeeScript 1.10.0
(function() {
  var a, articlize, arts, find, n,
    slice = [].slice;

  a = 'a';

  n = 'an';

  arts = {
    0: {
      8: {
        _: n
      },
      9: {
        _: n
      },
      "-": {
        1: {
          1: {
            _: n
          }
        },
        4: {
          " ": {
            _: a
          },
          _: n
        },
        6: {
          "-": {
            _: n
          }
        },
        8: {
          _: n
        }
      }
    },
    1: {
      1: {
        0: {
          _: a
        },
        1: {
          _: a
        },
        2: {
          _: a
        },
        3: {
          _: a
        },
        4: {
          _: a
        },
        5: {
          _: a
        },
        6: {
          _: a
        },
        7: {
          _: a
        },
        8: {
          _: a
        },
        9: {
          _: a
        },
        _: n,
        ".": {
          4: {
            _: a
          }
        }
      },
      8: {
        0: {
          0: {
            _: n
          },
          1: {
            _: n
          },
          2: {
            _: n
          },
          3: {
            _: n
          },
          4: {
            _: n
          },
          5: {
            _: n
          },
          6: {
            _: n
          },
          7: {
            _: n
          },
          8: {
            _: n
          },
          9: {
            _: n
          },
          _: a
        },
        1: {
          "-": {
            _: a
          },
          " ": {
            _: a
          }
        },
        2: {
          "-": {
            _: a
          },
          " ": {
            _: a
          }
        },
        3: {
          "-": {
            _: a
          },
          " ": {
            _: a
          }
        },
        4: {
          "-": {
            _: a
          },
          " ": {
            _: a
          }
        },
        5: {
          "-": {
            _: a
          },
          " ": {
            _: a
          }
        },
        6: {
          "-": {
            _: a
          },
          " ": {
            _: a
          }
        },
        7: {
          "-": {
            _: a
          },
          " ": {
            _: a
          }
        },
        8: {
          "-": {
            _: a
          },
          " ": {
            _: a
          }
        },
        9: {
          "-": {
            _: a
          },
          " ": {
            _: a
          }
        },
        _: n
      }
    },
    8: {
      0: {
        0: {
          x: {
            _: a
          }
        }
      },
      9: {
        0: {
          _: a
        }
      },
      _: n,
      ",": {
        1: {
          _: a
        }
      }
    },
    "`": {
      a: {
        _: n
      }
    },
    "£": {
      8: {
        _: n
      }
    },
    "∞": {
      _: n
    },
    a: {
      " ": {
        _: a
      },
      b: {
        o: {
          u: {
            t: {
              "-": {
                _: n
              }
            },
            _: a
          }
        }
      },
      g: {
        a: {
          i: {
            _: a
          }
        }
      },
      l: {
        "-": {
          I: {
            _: a
          }
        },
        g: {
          u: {
            _: a
          }
        },
        t: {
          h: {
            _: a
          }
        }
      },
      m: {
        o: {
          n: {
            _: a
          }
        }
      },
      n: {
        " ": {
          _: a
        },
        d: {
          a: {
            _: n
          },
          e: {
            _: n
          },
          r: {
            _: n
          },
          _: a
        },
        o: {
          t: {
            _: a
          }
        },
        y: {
          w: {
            _: a
          }
        }
      },
      p: {
        r: {
          e: {
            _: a
          }
        }
      },
      r: {
        e: {
          " ": {
            _: a
          },
          ":": {
            _: a
          }
        },
        t: {
          "í": {
            _: a
          }
        }
      },
      _: n
    },
    A: {
      $: {
        _: a
      },
      A: {
        A: {
          _: a
        }
      },
      n: {
        d: {
          a: {
            l: {
              u: {
                c: {
                  _: a
                }
              }
            }
          }
        }
      },
      r: {
        m: {
          a: {
            t: {
              _: a
            }
          }
        }
      },
      s: {
        t: {
          u: {
            r: {
              i: {
                a: {
                  s: {
                    _: a
                  }
                }
              }
            }
          }
        }
      },
      t: {
        h: {
          l: {
            e: {
              t: {
                i: {
                  _: n
                }
              }
            },
            o: {
              _: n
            },
            _: a
          }
        }
      },
      U: {
        $: {
          _: a
        },
        D: {
          _: a
        },
        S: {
          C: {
            _: a
          }
        }
      },
      _: n
    },
    "Á": {
      _: n
    },
    "á": {
      ";": {
        _: n
      }
    },
    "à": {
      _: n
    },
    "Ä": {
      _: n
    },
    "ā": {
      _: n
    },
    "Å": {
      _: n
    },
    "æ": {
      _: n
    },
    "Æ": {
      n: {
        _: a
      },
      _: n
    },
    D: {
      "ú": {
        n: {
          _: a
        }
      }
    },
    e: {
      ".": {
        g: {
          _: a
        }
      },
      a: {
        c: {
          h: {
            " ": {
              _: a
            }
          }
        }
      },
      i: {
        t: {
          h: {
            e: {
              r: {
                " ": {
                  _: a
                },
                ".": {
                  _: a
                }
              }
            }
          }
        }
      },
      l: {
        "-": {
          _: a
        },
        l: {
          a: {
            _: a
          }
        }
      },
      m: {
        p: {
          e: {
            z: {
              _: a
            }
          }
        }
      },
      n: {
        o: {
          u: {
            g: {
              _: a
            }
          }
        }
      },
      u: {
        p: {
          " ": {
            _: n
          }
        },
        _: a
      },
      w: {
        _: a
      },
      x: {
        i: {
          s: {
            t: {
              s: {
                _: a
              }
            }
          }
        }
      },
      _: n
    },
    E: {
      m: {
        p: {
          e: {
            z: {
              _: a
            }
          }
        }
      },
      n: {
        a: {
          m: {
            _: a
          }
        }
      },
      s: {
        p: {
          a: {
            d: {
              _: n
            }
          },
          e: {
            _: n
          },
          o: {
            _: n
          },
          _: a
        }
      },
      u: {
        l: {
          _: n
        },
        _: a
      },
      U: {
        R: {
          _: a
        }
      },
      _: n
    },
    "é": {
      g: {
        _: a
      },
      t: {
        a: {
          _: n
        },
        u: {
          _: n
        },
        _: a
      },
      _: n
    },
    "É": {
      _: n
    },
    f: {
      "-": {
        _: n
      },
      " ": {
        _: n
      },
      "/": {
        _: n
      },
      M: {
        _: n
      },
      p: {
        _: n
      },
      t: {
        _: n
      }
    },
    F: {
      0: {
        _: n
      },
      1: {
        _: n
      },
      2: {
        _: n
      },
      3: {
        _: n
      },
      4: {
        _: n
      },
      5: {
        _: n
      },
      6: {
        _: n
      },
      9: {
        _: n
      },
      "'": {
        _: n
      },
      "-": {
        _: n
      },
      " ": {
        _: n
      },
      "\"": {
        _: n
      },
      "#": {
        _: n
      },
      ",": {
        _: n
      },
      ".": {
        _: n
      },
      "/": {
        _: n
      },
      "”": {
        _: n
      },
      A: {
        C: {
          _: a
        },
        D: {
          _: a
        },
        I: {
          R: {
            _: a
          }
        },
        L: {
          _: a
        },
        M: {
          _: a
        },
        N: {
          _: a
        },
        P: {
          _: a
        },
        Q: {
          _: a
        },
        R: {
          _: a
        },
        S: {
          _: a
        },
        T: {
          _: a
        },
        _: n
      },
      B: {
        _: n
      },
      C: {
        _: n
      },
      c: {
        _: n
      },
      D: {
        _: n
      },
      E: {
        C: {
          _: n
        },
        I: {
          _: n
        }
      },
      F: {
        " ": {
          _: a
        },
        _: n
      },
      f: {
        _: n
      },
      h: {
        _: n
      },
      H: {
        _: n
      },
      I: {
        A: {
          T: {
            _: a
          },
          _: n
        },
        D: {
          " ": {
            _: n
          }
        },
        R: {
          " ": {
            _: n
          }
        },
        S: {
          " ": {
            _: n
          }
        }
      },
      K: {
        _: n
      },
      L: {
        C: {
          _: n
        },
        N: {
          _: n
        },
        P: {
          _: n
        }
      },
      M: {
        R: {
          _: a
        },
        _: n
      },
      O: {
        " ": {
          _: n
        },
        I: {
          " ": {
            _: n
          }
        }
      },
      P: {
        ".": {
          _: a
        },
        "?": {
          _: a
        },
        C: {
          "?": {
            _: a
          }
        },
        _: n
      },
      R: {
        C: {
          _: n
        },
        S: {
          _: n
        }
      },
      S: {
        _: n
      },
      T: {
        S: {
          _: a
        },
        T: {
          _: a
        },
        _: n
      },
      U: {
        " ": {
          _: n
        },
        ",": {
          _: n
        },
        ".": {
          _: n
        }
      },
      V: {
        _: n
      },
      W: {
        D: {
          _: a
        },
        _: n
      },
      X: {
        _: n
      },
      Y: {
        _: n
      },
      "σ": {
        _: n
      }
    },
    G: {
      h: {
        a: {
          e: {
            _: n
          },
          i: {
            _: n
          }
        }
      }
    },
    h: {
      "'": {
        _: n
      },
      "-": {
        U: {
          _: a
        },
        _: n
      },
      " ": {
        _: n
      },
      "\"": {
        _: n
      },
      ",": {
        _: n
      },
      C: {
        _: n
      },
      e: {
        i: {
          r: {
            a: {
              _: a
            },
            _: n
          }
        }
      },
      i: {
        m: {
          s: {
            _: n
          }
        },
        s: {
          t: {
            o: {
              r: {
                i: {
                  c: {
                    _: a
                  }
                }
              }
            }
          }
        }
      },
      o: {
        m: {
          a: {
            _: n
          },
          m: {
            _: n
          }
        },
        n: {
          e: {
            y: {
              _: a
            }
          },
          k: {
            _: a
          },
          v: {
            _: a
          },
          _: n
        },
        r: {
          s: {
            " ": {
              _: n
            }
          }
        },
        u: {
          r: {
            _: n
          }
        }
      },
      t: {
        t: {
          p: {
            " ": {
              _: n
            }
          },
          _: a
        },
        _: n
      }
    },
    H: {
      1: {
        _: n
      },
      2: {
        _: n
      },
      3: {
        _: n
      },
      4: {
        _: n
      },
      5: {
        _: n
      },
      "'": {
        _: n
      },
      "-": {
        _: n
      },
      " ": {
        _: n
      },
      "\"": {
        _: n
      },
      "&": {
        _: n
      },
      ",": {
        _: n
      },
      ".": {
        A: {
          _: a
        },
        _: n
      },
      "+": {
        _: n
      },
      a: {
        b: {
          i: {
            l: {
              i: {
                t: {
                  a: {
                    t: {
                      i: {
                        o: {
                          n: {
                            s: {
                              _: n
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      B: {
        _: n
      },
      C: {
        _: n
      },
      D: {
        B: {
          _: a
        },
        _: n
      },
      e: {
        i: {
          r: {
            _: n
          }
        }
      },
      F: {
        _: n
      },
      G: {
        _: n
      },
      H: {
        _: n
      },
      I: {
        D: {
          _: a
        },
        G: {
          _: a
        },
        M: {
          _: a
        },
        P: {
          _: a
        },
        _: n
      },
      L: {
        A: {
          "-": {
            D: {
              _: a
            }
          }
        },
        _: n
      },
      M: {
        _: n
      },
      N: {
        _: n
      },
      o: {
        n: {
          d: {
            _: a
          },
          e: {
            s: {
              _: n
            },
            _: a
          },
          g: {
            _: a
          },
          k: {
            _: a
          },
          o: {
            l: {
              _: a
            }
          },
          _: n
        },
        u: {
          r: {
            _: n
          }
        }
      },
      O: {
        " ": {
          _: n
        },
        V: {
          _: n
        }
      },
      P: {
        _: n
      },
      Q: {
        _: n
      },
      R: {
        T: {
          _: a
        },
        _: n
      },
      S: {
        " ": {
          _: a
        },
        R: {
          _: a
        },
        T: {
          _: a
        },
        _: n
      },
      T: {
        P: {
          _: a
        },
        _: n
      },
      V: {
        _: n
      },
      W: {
        T: {
          _: n
        }
      }
    },
    i: {
      ".": {
        e: {
          _: a
        }
      },
      b: {
        n: {
          _: a
        }
      },
      f: {
        " ": {
          _: a
        }
      },
      i: {
        _: a
      },
      n: {
        c: {
          l: {
            u: {
              d: {
                i: {
                  _: a
                }
              }
            }
          }
        },
        d: {
          i: {
            c: {
              a: {
                t: {
                  e: {
                    s: {
                      _: a
                    }
                  }
                }
              }
            }
          }
        },
        s: {
          t: {
            e: {
              a: {
                d: {
                  "?": {
                    _: n
                  }
                },
                _: a
              }
            }
          }
        }
      },
      s: {
        " ": {
          _: a
        },
        ".": {
          _: a
        }
      },
      t: {
        " ": {
          _: a
        }
      },
      u: {
        _: a
      },
      _: n
    },
    I: {
      "-": {
        A: {
          _: a
        },
        I: {
          _: a
        }
      },
      I: {
        I: {
          _: a
        }
      },
      l: {
        b: {
          _: a
        }
      },
      M: {
        H: {
          _: a
        }
      },
      m: {
        a: {
          m: {
            s: {
              _: a
            }
          }
        }
      },
      R: {
        "£": {
          _: a
        }
      },
      s: {
        l: {
          a: {
            m: {
              " ": {
                _: a
              },
              ",": {
                _: a
              },
              ".": {
                _: a
              }
            },
            n: {
              d: {
                s: {
                  _: a
                }
              }
            }
          }
        }
      },
      _: n
    },
    "İ": {
      _: n
    },
    J: {
      i: {
        a: {
          n: {
            _: a
          },
          _: n
        }
      }
    },
    k: {
      u: {
        " ": {
          _: n
        }
      }
    },
    l: {
      " ": {
        _: n
      },
      "\"": {
        _: n
      },
      p: {
        _: n
      }
    },
    L: {
      1: {
        _: n
      },
      2: {
        _: n
      },
      3: {
        _: n
      },
      5: {
        _: n
      },
      "'": {
        A: {
          _: a
        },
        _: n
      },
      "-": {
        a: {
          _: a
        },
        _: n
      },
      " ": {
        _: n
      },
      "\"": {
        _: n
      },
      "&": {
        _: n
      },
      ",": {
        _: n
      },
      ".": {
        _: n
      },
      "/": {
        _: n
      },
      a: {
        e: {
          _: n
        },
        o: {
          i: {
            g: {
              _: n
            }
          }
        }
      },
      A: {
        " ": {
          _: n
        },
        L: {
          _: n
        },
        P: {
          _: n
        }
      },
      B: {
        _: n
      },
      C: {
        _: n
      },
      D: {
        _: n
      },
      E: {
        A: {
          _: a
        },
        E: {
          _: a
        },
        G: {
          _: a
        },
        O: {
          _: a
        },
        P: {
          _: a
        },
        T: {
          _: a
        },
        _: n
      },
      F: {
        _: n
      },
      G: {
        _: n
      },
      H: {
        _: n
      },
      I: {
        R: {
          _: n
        }
      },
      L: {
        _: n
      },
      M: {
        X: {
          _: a
        },
        _: n
      },
      N: {
        _: n
      },
      o: {
        c: {
          h: {
            a: {
              _: n
            }
          }
        }
      },
      O: {
        E: {
          _: n
        }
      },
      P: {
        _: n
      },
      R: {
        _: n
      },
      S: {
        _: n
      },
      T: {
        _: n
      },
      U: {
        " ": {
          _: n
        }
      },
      V: {
        _: n
      },
      X: {
        _: n
      },
      Z: {
        _: n
      }
    },
    m: {
      "-": {
        _: n
      },
      " ": {
        _: n
      },
      "\"": {
        _: n
      },
      "&": {
        _: n
      },
      a: {
        k: {
          e: {
            s: {
              " ": {
                _: n
              }
            }
          }
        }
      },
      b: {
        _: n
      },
      e: {
        i: {
          n: {
            _: n
          }
        },
        n: {
          t: {
            i: {
              o: {
                n: {
                  s: {
                    _: n
                  }
                }
              }
            }
          }
        }
      },
      f: {
        _: n
      },
      p: {
        _: n
      },
      R: {
        _: n
      },
      t: {
        _: n
      }
    },
    M: {
      1: {
        9: {
          0: {
            _: n
          },
          _: a
        },
        _: n
      },
      2: {
        _: n
      },
      3: {
        _: n
      },
      4: {
        _: n
      },
      5: {
        _: n
      },
      6: {
        _: n
      },
      7: {
        _: n
      },
      8: {
        _: n
      },
      9: {
        _: n
      },
      "'": {
        _: n
      },
      "-": {
        t: {
          _: a
        },
        _: n
      },
      " ": {
        _: n
      },
      "\"": {
        _: n
      },
      "&": {
        _: n
      },
      ",": {
        _: n
      },
      ".": {
        A: {
          ".": {
            S: {
              _: a
            }
          }
        },
        _: n
      },
      "/": {
        _: n
      },
      A: {
        C: {
          _: a
        },
        D: {
          _: a
        },
        F: {
          _: a
        },
        G: {
          _: a
        },
        J: {
          _: a
        },
        L: {
          _: a
        },
        M: {
          _: a
        },
        N: {
          _: a
        },
        P: {
          _: a
        },
        R: {
          _: a
        },
        S: {
          _: a
        },
        T: {
          _: a
        },
        X: {
          _: a
        },
        Y: {
          _: a
        },
        _: n
      },
      B: {
        _: n
      },
      C: {
        _: n
      },
      D: {
        _: n
      },
      e: {
        "-": {
          _: n
        }
      },
      E: {
        d: {
          _: n
        },
        n: {
          _: n
        },
        P: {
          _: n
        }
      },
      F: {
        _: n
      },
      f: {
        _: n
      },
      G: {
        _: n
      },
      H: {
        _: n
      },
      h: {
        _: n
      },
      i: {
        e: {
          _: n
        }
      },
      I: {
        5: {
          _: n
        },
        6: {
          _: n
        },
        " ": {
          _: n
        },
        A: {
          _: n
        },
        T: {
          _: n
        }
      },
      K: {
        _: n
      },
      L: {
        _: n
      },
      M: {
        T: {
          _: a
        },
        _: n
      },
      N: {
        _: n
      },
      o: {
        U: {
          _: n
        }
      },
      O: {
        " ": {
          _: n
        },
        T: {
          " ": {
            _: n
          }
        },
        U: {
          _: n
        }
      },
      P: {
        _: n
      },
      R: {
        _: n
      },
      S: {
        _: n
      },
      s: {
        c: {
          _: n
        }
      },
      T: {
        R: {
          _: a
        },
        _: n
      },
      U: {
        V: {
          _: n
        }
      },
      V: {
        _: n
      },
      X: {
        _: n
      }
    },
    N: {
      4: {
        _: n
      },
      6: {
        _: n
      },
      "'": {
        _: n
      },
      "-": {
        a: {
          _: a
        },
        S: {
          _: a
        },
        _: n
      },
      " ": {
        _: n
      },
      "\"": {
        _: n
      },
      ",": {
        _: n
      },
      ".": {
        Y: {
          _: a
        },
        _: n
      },
      "=": {
        _: n
      },
      "²": {
        _: n
      },
      a: {
        o: {
          _: n
        }
      },
      A: {
        " ": {
          _: n
        },
        A: {
          F: {
            _: a
          },
          _: n
        },
        I: {
          _: n
        },
        S: {
          L: {
            _: n
          }
        }
      },
      B: {
        _: n
      },
      C: {
        _: n
      },
      D: {
        _: n
      },
      E: {
        A: {
          _: n
        },
        H: {
          _: n
        },
        S: {
          " ": {
            _: n
          }
        }
      },
      F: {
        _: n
      },
      G: {
        _: n
      },
      H: {
        _: n
      },
      I: {
        C: {
          _: a
        },
        L: {
          _: a
        },
        M: {
          H: {
            _: n
          },
          _: a
        },
        N: {
          _: a
        },
        S: {
          _: a
        },
        _: n
      },
      J: {
        C: {
          _: n
        }
      },
      K: {
        _: n
      },
      L: {
        S: {
          _: a
        },
        _: n
      },
      M: {
        _: n
      },
      N: {
        R: {
          _: n
        },
        T: {
          _: n
        }
      },
      P: {
        O: {
          V: {
            "-": {
              _: n
            }
          },
          _: a
        },
        _: n
      },
      R: {
        J: {
          _: a
        },
        T: {
          _: a
        },
        _: n
      },
      S: {
        W: {
          _: a
        },
        _: n
      },
      T: {
        $: {
          _: a
        },
        _: n
      },
      U: {
        S: {
          _: n
        }
      },
      V: {
        _: n
      },
      v: {
        _: n
      },
      W: {
        A: {
          _: n
        }
      },
      X: {
        _: n
      },
      Y: {
        P: {
          _: n
        },
        U: {
          _: n
        }
      }
    },
    n: {
      "-": {
        _: n
      },
      "−": {
        _: n
      },
      " ": {
        _: n
      },
      "\"": {
        _: n
      },
      "&": {
        _: n
      },
      ",": {
        _: n
      },
      "+": {
        _: n
      },
      "×": {
        _: n
      },
      d: {
        a: {
          _: n
        }
      },
      p: {
        a: {
          _: n
        }
      },
      t: {
        _: n
      },
      V: {
        _: n
      },
      W: {
        _: n
      }
    },
    o: {
      b: {
        r: {
          _: a
        }
      },
      c: {
        c: {
          u: {
            r: {
              s: {
                _: a
              }
            }
          }
        },
        h: {
          o: {
            _: a
          }
        }
      },
      f: {
        " ": {
          _: a
        }
      },
      n: {
        "-": {
          _: n
        },
        "/": {
          _: n
        },
        b: {
          _: n
        },
        c: {
          o: {
            _: n
          }
        },
        d: {
          _: n
        },
        e: {
          r: {
            _: n
          }
        },
        g: {
          _: n
        },
        i: {
          _: n
        },
        l: {
          _: n
        },
        m: {
          _: n
        },
        o: {
          _: n
        },
        r: {
          _: n
        },
        s: {
          _: n
        },
        t: {
          _: n
        },
        u: {
          _: n
        },
        w: {
          _: n
        },
        y: {
          _: n
        },
        _: a
      },
      r: {
        " ": {
          _: a
        },
        ",": {
          _: a
        }
      },
      u: {
        i: {
          _: a
        }
      },
      _: n
    },
    O: {
      b: {
        e: {
          r: {
            s: {
              t: {
                " ": {
                  _: n
                },
                l: {
                  _: n
                }
              },
              _: a
            }
          }
        }
      },
      l: {
        v: {
          _: a
        }
      },
      n: {
        e: {
          i: {
            _: n
          },
          _: a
        }
      },
      N: {
        E: {
          _: a
        }
      },
      o: {
        p: {
          _: a
        }
      },
      u: {
        i: {
          _: a
        }
      },
      _: n
    },
    "Ó": {
      _: n
    },
    "Ö": {
      _: n
    },
    "ö": {
      _: n
    },
    "Ō": {
      _: n
    },
    "ō": {
      _: n
    },
    P: {
      h: {
        o: {
          b: {
            _: n
          },
          i: {
            _: n
          }
        }
      }
    },
    r: {
      "'": {
        _: n
      },
      "-": {
        _: n
      },
      " ": {
        _: n
      },
      "\"": {
        _: n
      },
      "&": {
        _: n
      },
      ".": {
        _: n
      },
      e: {
        f: {
          e: {
            r: {
              s: {
                _: n
              }
            }
          }
        }
      },
      f: {
        _: n
      },
      m: {
        _: n
      },
      s: {
        _: n
      }
    },
    R: {
      1: {
        0: {
          _: a
        },
        _: n
      },
      2: {
        _: n
      },
      3: {
        _: n
      },
      4: {
        _: n
      },
      5: {
        _: n
      },
      6: {
        _: n
      },
      "'": {
        _: n
      },
      "-": {
        _: n
      },
      " ": {
        _: n
      },
      "\"": {
        _: n
      },
      "&": {
        _: n
      },
      ",": {
        _: n
      },
      ".": {
        C: {
          _: a
        },
        _: n
      },
      "/": {
        _: n
      },
      A: {
        " ": {
          _: n
        },
        F: {
          _: n
        }
      },
      B: {
        _: n
      },
      C: {
        _: n
      },
      D: {
        _: n
      },
      E: {
        " ": {
          _: n
        },
        R: {
          _: n
        }
      },
      F: {
        _: n
      },
      f: {
        _: n
      },
      G: {
        _: n
      },
      H: {
        S: {
          _: n
        }
      },
      I: {
        A: {
          _: n
        },
        C: {
          " ": {
            _: n
          }
        }
      },
      J: {
        _: n
      },
      K: {
        _: n
      },
      L: {
        " ": {
          _: a
        },
        _: n
      },
      M: {
        1: {
          _: a
        },
        _: n
      },
      N: {
        G: {
          _: a
        },
        _: n
      },
      O: {
        T: {
          _: n
        }
      },
      P: {
        _: n
      },
      Q: {
        _: n
      },
      R: {
        _: n
      },
      S: {
        " ": {
          _: a
        },
        ")": {
          _: a
        },
        ",": {
          _: a
        },
        ".": {
          _: a
        },
        "?": {
          _: a
        },
        T: {
          _: a
        },
        _: n
      },
      T: {
        _: n
      },
      U: {
        _: n
      },
      V: {
        _: n
      },
      X: {
        _: n
      }
    },
    s: {
      "-": {
        _: n
      },
      "\"": {
        _: n
      },
      ")": {
        _: n
      },
      ",": {
        _: n
      },
      ".": {
        _: n
      },
      a: {
        y: {
          s: {
            _: n
          }
        }
      },
      i: {
        c: {
          h: {
            _: n
          }
        }
      },
      p: {
        3: {
          _: n
        },
        r: {
          o: {
            t: {
              _: n
            }
          }
        }
      },
      s: {
        h: {
          _: n
        }
      },
      t: {
        a: {
          t: {
            e: {
              s: {
                " ": {
                  _: n
                },
                ":": {
                  _: n
                }
              }
            }
          }
        }
      },
      v: {
        a: {
          _: a
        },
        e: {
          _: a
        },
        _: n
      }
    },
    S: {
      1: {
        _: n
      },
      2: {
        _: n
      },
      3: {
        _: n
      },
      4: {
        _: n
      },
      5: {
        _: n
      },
      6: {
        _: n
      },
      "'": {
        _: n
      },
      "-": {
        _: n
      },
      " ": {
        _: n
      },
      "\"": {
        _: n
      },
      "&": {
        W: {
          _: a
        },
        _: n
      },
      ",": {
        _: n
      },
      ".": {
        B: {
          _: n
        },
        M: {
          _: n
        },
        O: {
          _: n
        }
      },
      "”": {
        _: n
      },
      A: {
        "-": {
          1: {
            _: a
          },
          _: n
        },
        " ": {
          _: n
        },
        C: {
          D: {
            _: n
          }
        },
        E: {
          _: n
        },
        S: {
          E: {
            _: a
          },
          _: n
        },
        T: {
          " ": {
            _: n
          },
          B: {
            _: n
          }
        }
      },
      B: {
        _: n
      },
      C: {
        A: {
          " ": {
            _: n
          }
        },
        C: {
          _: n
        },
        M: {
          _: n
        },
        O: {
          " ": {
            _: n
          }
        },
        R: {
          A: {
            _: a
          },
          _: n
        },
        T: {
          _: n
        }
      },
      D: {
        _: n
      },
      E: {
        " ": {
          _: n
        },
        C: {
          O: {
            _: a
          },
          R: {
            _: a
          },
          _: n
        },
        I: {
          _: n
        },
        O: {
          _: n
        }
      },
      F: {
        _: n
      },
      G: {
        _: n
      },
      H: {
        2: {
          _: n
        },
        3: {
          _: n
        },
        "-": {
          _: n
        }
      },
      I: {
        " ": {
          _: n
        }
      },
      J: {
        _: n
      },
      K: {
        _: n
      },
      L: {
        A: {
          _: a
        },
        I: {
          _: a
        },
        O: {
          _: a
        },
        _: n
      },
      M: {
        A: {
          _: a
        },
        E: {
          " ": {
            _: n
          },
          _: a
        },
        I: {
          _: a
        },
        _: n
      },
      N: {
        A: {
          _: a
        },
        E: {
          _: a
        },
        O: {
          _: a
        },
        _: n
      },
      O: {
        "(": {
          _: n
        },
        A: {
          " ": {
            _: n
          },
          I: {
            _: n
          }
        },
        E: {
          _: n
        },
        I: {
          _: n
        },
        S: {
          _: n
        },
        V: {
          _: n
        }
      },
      P: {
        A: {
          C: {
            _: a
          },
          D: {
            _: a
          },
          M: {
            _: a
          },
          N: {
            _: a
          },
          R: {
            _: a
          }
        },
        E: {
          " ": {
            _: n
          },
          _: a
        },
        I: {
          C: {
            _: a
          }
        },
        O: {
          _: a
        },
        U: {
          _: a
        },
        _: n
      },
      R: {
        _: n
      },
      S: {
        _: n
      },
      T: {
        "-": {
          _: n
        },
        A: {
          " ": {
            _: n
          }
        },
        B: {
          _: n
        },
        C: {
          _: n
        },
        D: {
          _: n
        },
        F: {
          _: n
        },
        L: {
          _: n
        },
        M: {
          _: n
        },
        S: {
          _: n
        },
        V: {
          _: n
        }
      },
      u: {
        r: {
          a: {
            " ": {
              _: n
            }
          }
        }
      },
      U: {
        B: {
          _: a
        },
        L: {
          _: a
        },
        N: {
          _: a
        },
        P: {
          _: a
        },
        S: {
          _: a
        },
        _: n
      },
      V: {
        _: n
      },
      W: {
        F: {
          _: n
        },
        P: {
          _: n
        },
        R: {
          _: n
        }
      },
      X: {
        S: {
          _: a
        },
        _: n
      }
    },
    t: {
      "-": {
        S: {
          _: n
        }
      },
      S: {
        _: n
      }
    },
    T: {
      a: {
        v: {
          e: {
            s: {
              _: n
            }
          }
        }
      },
      "à": {
        _: n
      }
    },
    u: {
      "-": {
        _: a
      },
      " ": {
        _: a
      },
      "\"": {
        _: a
      },
      ".": {
        _: a
      },
      b: {
        e: {
          _: n
        },
        _: a
      },
      f: {
        _: a
      },
      k: {
        a: {
          _: n
        },
        _: a
      },
      l: {
        u: {
          _: a
        }
      },
      m: {
        " ": {
          _: a
        }
      },
      n: {
        " ": {
          _: a
        },
        a: {
          " ": {
            _: a
          },
          n: {
            a: {
              _: n
            },
            n: {
              _: n
            },
            s: {
              _: n
            },
            t: {
              _: n
            },
            _: a
          },
          r: {
            y: {
              _: a
            }
          }
        },
        e: {
          " ": {
            _: a
          }
        },
        i: {
          c: {
            o: {
              r: {
                p: {
                  _: n
                }
              }
            }
          },
          d: {
            i: {
              _: a
            },
            _: n
          },
          m: {
            o: {
              _: a
            },
            _: n
          },
          n: {
            _: n
          },
          v: {
            o: {
              _: n
            }
          },
          _: a
        },
        l: {
          e: {
            s: {
              _: a
            }
          }
        }
      },
      p: {
        o: {
          _: a
        }
      },
      r: {
        a: {
          _: a
        },
        e: {
          _: a
        },
        i: {
          _: a
        },
        l: {
          _: a
        },
        o: {
          _: a
        }
      },
      s: {
        "-": {
          _: n
        },
        " ": {
          _: n
        },
        h: {
          _: n
        },
        _: a
      },
      t: {
        m: {
          _: n
        },
        t: {
          _: n
        },
        _: a
      },
      v: {
        _: a
      },
      w: {
        _: a
      },
      _: n
    },
    U: {
      1: {
        _: n
      },
      "-": {
        B: {
          o: {
            _: a
          },
          _: n
        }
      },
      a: {
        _: n
      },
      b: {
        i: {
          _: a
        },
        _: n
      },
      D: {
        P: {
          "-": {
            _: n
          }
        }
      },
      d: {
        _: n
      },
      g: {
        l: {
          _: n
        }
      },
      h: {
        _: n
      },
      i: {
        _: n
      },
      l: {
        i: {
          _: a
        },
        _: n
      },
      m: {
        _: n
      },
      M: {
        N: {
          _: n
        }
      },
      n: {
        "-": {
          _: n
        },
        a: {
          n: {
            _: a
          },
          _: n
        },
        b: {
          _: n
        },
        c: {
          _: n
        },
        d: {
          _: n
        },
        e: {
          s: {
            _: a
          },
          _: n
        },
        f: {
          _: n
        },
        g: {
          _: n
        },
        h: {
          _: n
        },
        i: {
          d: {
            _: n
          },
          n: {
            _: n
          }
        },
        k: {
          _: n
        },
        l: {
          _: n
        },
        m: {
          _: n
        },
        n: {
          _: n
        },
        o: {
          _: n
        },
        p: {
          _: n
        },
        r: {
          _: n
        },
        s: {
          _: n
        },
        t: {
          e: {
            r: {
              s: {
                _: a
              }
            }
          },
          _: n
        },
        u: {
          _: n
        },
        w: {
          _: n
        }
      },
      p: {
        _: n
      },
      r: {
        a: {
          _: a
        },
        i: {
          _: a
        },
        u: {
          g: {
            u: {
              a: {
                y: {
                  a: {
                    n: {
                      "-": {
                        _: n
                      }
                    }
                  }
                }
              }
            }
          },
          k: {
            _: n
          },
          _: a
        },
        _: n
      },
      s: {
        h: {
          _: n
        },
        t: {
          _: n
        }
      },
      t: {
        n: {
          _: n
        },
        o: {
          "-": {
            _: n
          }
        },
        r: {
          _: n
        },
        t: {
          _: n
        }
      },
      x: {
        _: n
      },
      z: {
        _: n
      }
    },
    "ü": {
      _: n
    },
    "Ü": {
      _: n
    },
    V: {
      I: {
        I: {
          _: n
        }
      }
    },
    x: {
      a: {
        _: a
      },
      e: {
        _: a
      },
      i: {
        _: a
      },
      o: {
        _: a
      },
      x: {
        _: a
      },
      y: {
        _: a
      },
      _: n
    },
    X: {
      a: {
        _: a
      },
      A: {
        _: a
      },
      e: {
        _: a
      },
      h: {
        _: a
      },
      i: {
        _: a
      },
      I: {
        V: {
          _: a
        },
        X: {
          _: a
        }
      },
      o: {
        _: a
      },
      u: {
        _: a
      },
      U: {
        _: a
      },
      V: {
        _: a
      },
      X: {
        " ": {
          _: n
        },
        _: a
      },
      y: {
        _: a
      },
      _: n
    },
    Y: {
      p: {
        _: n
      }
    },
    "α": {
      _: n
    },
    "ε": {
      _: n
    },
    "ω": {
      _: n
    }
  };

  find = function(word, obj, article) {
    var key;
    if (obj == null) {
      obj = arts;
    }
    if (article == null) {
      article = 'a';
    }
    if (word == null) {
      return article;
    }
    key = word.slice(0, 1);
    obj = obj[key];
    if ((key != null) && (obj != null)) {
      return find(word.slice(1), obj, obj._ || article);
    } else {
      return article;
    }
  };

  articlize = function() {
    var input, inputs, out;
    inputs = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    out = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = inputs.length; i < len; i++) {
        input = inputs[i];
        if (input != null) {
          results.push((find(input)) + " " + input);
        }
      }
      return results;
    })();
    if (inputs.length === 1) {
      return out[0];
    } else {
      return out;
    }
  };

  module.exports = {
    find: find,
    articlize: articlize
  };

}).call(this);

},{}],3:[function(require,module,exports){
!function(globals) {
'use strict'

var convertHex = {
  bytesToHex: function(bytes) {
    /*if (typeof bytes.byteLength != 'undefined') {
      var newBytes = []

      if (typeof bytes.buffer != 'undefined')
        bytes = new DataView(bytes.buffer)
      else
        bytes = new DataView(bytes)

      for (var i = 0; i < bytes.byteLength; ++i) {
        newBytes.push(bytes.getUint8(i))
      }
      bytes = newBytes
    }*/
    return arrBytesToHex(bytes)
  },
  hexToBytes: function(hex) {
    if (hex.length % 2 === 1) throw new Error("hexToBytes can't have a string with an odd number of characters.")
    if (hex.indexOf('0x') === 0) hex = hex.slice(2)
    return hex.match(/../g).map(function(x) { return parseInt(x,16) })
  }
}


// PRIVATE

function arrBytesToHex(bytes) {
  return bytes.map(function(x) { return padLeft(x.toString(16),2) }).join('')
}

function padLeft(orig, len) {
  if (orig.length > len) return orig
  return Array(len - orig.length + 1).join('0') + orig
}


if (typeof module !== 'undefined' && module.exports) { //CommonJS
  module.exports = convertHex
} else {
  globals.convertHex = convertHex
}

}(this);
},{}],4:[function(require,module,exports){
!function(globals) {
'use strict'

var convertString = {
  bytesToString: function(bytes) {
    return bytes.map(function(x){ return String.fromCharCode(x) }).join('')
  },
  stringToBytes: function(str) {
    return str.split('').map(function(x) { return x.charCodeAt(0) })
  }
}

//http://hossa.in/2012/07/20/utf-8-in-javascript.html
convertString.UTF8 = {
   bytesToString: function(bytes) {
    return decodeURIComponent(escape(convertString.bytesToString(bytes)))
  },
  stringToBytes: function(str) {
   return convertString.stringToBytes(unescape(encodeURIComponent(str)))
  }
}

if (typeof module !== 'undefined' && module.exports) { //CommonJS
  module.exports = convertString
} else {
  globals.convertString = convertString
}

}(this);
},{}],5:[function(require,module,exports){
/* global define */

(function (root, pluralize) {
  /* istanbul ignore else */
  if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
    // Node.
    module.exports = pluralize();
  } else if (typeof define === 'function' && define.amd) {
    // AMD, registers as an anonymous module.
    define(function () {
      return pluralize();
    });
  } else {
    // Browser global.
    root.pluralize = pluralize();
  }
})(this, function () {
  // Rule storage - pluralize and singularize need to be run sequentially,
  // while other rules can be optimized using an object for instant lookups.
  var pluralRules = [];
  var singularRules = [];
  var uncountables = {};
  var irregularPlurals = {};
  var irregularSingles = {};

  /**
   * Sanitize a pluralization rule to a usable regular expression.
   *
   * @param  {(RegExp|string)} rule
   * @return {RegExp}
   */
  function sanitizeRule (rule) {
    if (typeof rule === 'string') {
      return new RegExp('^' + rule + '$', 'i');
    }

    return rule;
  }

  /**
   * Pass in a word token to produce a function that can replicate the case on
   * another word.
   *
   * @param  {string}   word
   * @param  {string}   token
   * @return {Function}
   */
  function restoreCase (word, token) {
    // Tokens are an exact match.
    if (word === token) return token;

    // Upper cased words. E.g. "HELLO".
    if (word === word.toUpperCase()) return token.toUpperCase();

    // Title cased words. E.g. "Title".
    if (word[0] === word[0].toUpperCase()) {
      return token.charAt(0).toUpperCase() + token.substr(1).toLowerCase();
    }

    // Lower cased words. E.g. "test".
    return token.toLowerCase();
  }

  /**
   * Interpolate a regexp string.
   *
   * @param  {string} str
   * @param  {Array}  args
   * @return {string}
   */
  function interpolate (str, args) {
    return str.replace(/\$(\d{1,2})/g, function (match, index) {
      return args[index] || '';
    });
  }

  /**
   * Replace a word using a rule.
   *
   * @param  {string} word
   * @param  {Array}  rule
   * @return {string}
   */
  function replace (word, rule) {
    return word.replace(rule[0], function (match, index) {
      var result = interpolate(rule[1], arguments);

      if (match === '') {
        return restoreCase(word[index - 1], result);
      }

      return restoreCase(match, result);
    });
  }

  /**
   * Sanitize a word by passing in the word and sanitization rules.
   *
   * @param  {string}   token
   * @param  {string}   word
   * @param  {Array}    rules
   * @return {string}
   */
  function sanitizeWord (token, word, rules) {
    // Empty string or doesn't need fixing.
    if (!token.length || uncountables.hasOwnProperty(token)) {
      return word;
    }

    var len = rules.length;

    // Iterate over the sanitization rules and use the first one to match.
    while (len--) {
      var rule = rules[len];

      if (rule[0].test(word)) return replace(word, rule);
    }

    return word;
  }

  /**
   * Replace a word with the updated word.
   *
   * @param  {Object}   replaceMap
   * @param  {Object}   keepMap
   * @param  {Array}    rules
   * @return {Function}
   */
  function replaceWord (replaceMap, keepMap, rules) {
    return function (word) {
      // Get the correct token and case restoration functions.
      var token = word.toLowerCase();

      // Check against the keep object map.
      if (keepMap.hasOwnProperty(token)) {
        return restoreCase(word, token);
      }

      // Check against the replacement map for a direct word replacement.
      if (replaceMap.hasOwnProperty(token)) {
        return restoreCase(word, replaceMap[token]);
      }

      // Run all the rules against the word.
      return sanitizeWord(token, word, rules);
    };
  }

  /**
   * Check if a word is part of the map.
   */
  function checkWord (replaceMap, keepMap, rules, bool) {
    return function (word) {
      var token = word.toLowerCase();

      if (keepMap.hasOwnProperty(token)) return true;
      if (replaceMap.hasOwnProperty(token)) return false;

      return sanitizeWord(token, token, rules) === token;
    };
  }

  /**
   * Pluralize or singularize a word based on the passed in count.
   *
   * @param  {string}  word
   * @param  {number}  count
   * @param  {boolean} inclusive
   * @return {string}
   */
  function pluralize (word, count, inclusive) {
    var pluralized = count === 1
      ? pluralize.singular(word) : pluralize.plural(word);

    return (inclusive ? count + ' ' : '') + pluralized;
  }

  /**
   * Pluralize a word.
   *
   * @type {Function}
   */
  pluralize.plural = replaceWord(
    irregularSingles, irregularPlurals, pluralRules
  );

  /**
   * Check if a word is plural.
   *
   * @type {Function}
   */
  pluralize.isPlural = checkWord(
    irregularSingles, irregularPlurals, pluralRules
  );

  /**
   * Singularize a word.
   *
   * @type {Function}
   */
  pluralize.singular = replaceWord(
    irregularPlurals, irregularSingles, singularRules
  );

  /**
   * Check if a word is singular.
   *
   * @type {Function}
   */
  pluralize.isSingular = checkWord(
    irregularPlurals, irregularSingles, singularRules
  );

  /**
   * Add a pluralization rule to the collection.
   *
   * @param {(string|RegExp)} rule
   * @param {string}          replacement
   */
  pluralize.addPluralRule = function (rule, replacement) {
    pluralRules.push([sanitizeRule(rule), replacement]);
  };

  /**
   * Add a singularization rule to the collection.
   *
   * @param {(string|RegExp)} rule
   * @param {string}          replacement
   */
  pluralize.addSingularRule = function (rule, replacement) {
    singularRules.push([sanitizeRule(rule), replacement]);
  };

  /**
   * Add an uncountable word rule.
   *
   * @param {(string|RegExp)} word
   */
  pluralize.addUncountableRule = function (word) {
    if (typeof word === 'string') {
      uncountables[word.toLowerCase()] = true;
      return;
    }

    // Set singular and plural references for the word.
    pluralize.addPluralRule(word, '$0');
    pluralize.addSingularRule(word, '$0');
  };

  /**
   * Add an irregular word definition.
   *
   * @param {string} single
   * @param {string} plural
   */
  pluralize.addIrregularRule = function (single, plural) {
    plural = plural.toLowerCase();
    single = single.toLowerCase();

    irregularSingles[single] = plural;
    irregularPlurals[plural] = single;
  };

  /**
   * Irregular rules.
   */
  [
    // Pronouns.
    ['I', 'we'],
    ['me', 'us'],
    ['he', 'they'],
    ['she', 'they'],
    ['them', 'them'],
    ['myself', 'ourselves'],
    ['yourself', 'yourselves'],
    ['itself', 'themselves'],
    ['herself', 'themselves'],
    ['himself', 'themselves'],
    ['themself', 'themselves'],
    ['is', 'are'],
    ['was', 'were'],
    ['has', 'have'],
    ['this', 'these'],
    ['that', 'those'],
    // Words ending in with a consonant and `o`.
    ['echo', 'echoes'],
    ['dingo', 'dingoes'],
    ['volcano', 'volcanoes'],
    ['tornado', 'tornadoes'],
    ['torpedo', 'torpedoes'],
    // Ends with `us`.
    ['genus', 'genera'],
    ['viscus', 'viscera'],
    // Ends with `ma`.
    ['stigma', 'stigmata'],
    ['stoma', 'stomata'],
    ['dogma', 'dogmata'],
    ['lemma', 'lemmata'],
    ['schema', 'schemata'],
    ['anathema', 'anathemata'],
    // Other irregular rules.
    ['ox', 'oxen'],
    ['axe', 'axes'],
    ['die', 'dice'],
    ['yes', 'yeses'],
    ['foot', 'feet'],
    ['eave', 'eaves'],
    ['goose', 'geese'],
    ['tooth', 'teeth'],
    ['quiz', 'quizzes'],
    ['human', 'humans'],
    ['proof', 'proofs'],
    ['carve', 'carves'],
    ['valve', 'valves'],
    ['looey', 'looies'],
    ['thief', 'thieves'],
    ['groove', 'grooves'],
    ['pickaxe', 'pickaxes'],
    ['whiskey', 'whiskies']
  ].forEach(function (rule) {
    return pluralize.addIrregularRule(rule[0], rule[1]);
  });

  /**
   * Pluralization rules.
   */
  [
    [/s?$/i, 's'],
    [/[^\u0000-\u007F]$/i, '$0'],
    [/([^aeiou]ese)$/i, '$1'],
    [/(ax|test)is$/i, '$1es'],
    [/(alias|[^aou]us|tlas|gas|ris)$/i, '$1es'],
    [/(e[mn]u)s?$/i, '$1s'],
    [/([^l]ias|[aeiou]las|[emjzr]as|[iu]am)$/i, '$1'],
    [/(alumn|syllab|octop|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1i'],
    [/(alumn|alg|vertebr)(?:a|ae)$/i, '$1ae'],
    [/(seraph|cherub)(?:im)?$/i, '$1im'],
    [/(her|at|gr)o$/i, '$1oes'],
    [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|automat|quor)(?:a|um)$/i, '$1a'],
    [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)(?:a|on)$/i, '$1a'],
    [/sis$/i, 'ses'],
    [/(?:(kni|wi|li)fe|(ar|l|ea|eo|oa|hoo)f)$/i, '$1$2ves'],
    [/([^aeiouy]|qu)y$/i, '$1ies'],
    [/([^ch][ieo][ln])ey$/i, '$1ies'],
    [/(x|ch|ss|sh|zz)$/i, '$1es'],
    [/(matr|cod|mur|sil|vert|ind|append)(?:ix|ex)$/i, '$1ices'],
    [/(m|l)(?:ice|ouse)$/i, '$1ice'],
    [/(pe)(?:rson|ople)$/i, '$1ople'],
    [/(child)(?:ren)?$/i, '$1ren'],
    [/eaux$/i, '$0'],
    [/m[ae]n$/i, 'men'],
    ['thou', 'you']
  ].forEach(function (rule) {
    return pluralize.addPluralRule(rule[0], rule[1]);
  });

  /**
   * Singularization rules.
   */
  [
    [/s$/i, ''],
    [/(ss)$/i, '$1'],
    [/(wi|kni|(?:after|half|high|low|mid|non|night|[^\w]|^)li)ves$/i, '$1fe'],
    [/(ar|(?:wo|[ae])l|[eo][ao])ves$/i, '$1f'],
    [/ies$/i, 'y'],
    [/\b([pl]|zomb|(?:neck|cross)?t|coll|faer|food|gen|goon|group|lass|talk|goal|cut)ies$/i, '$1ie'],
    [/\b(mon|smil)ies$/i, '$1ey'],
    [/(m|l)ice$/i, '$1ouse'],
    [/(seraph|cherub)im$/i, '$1'],
    [/(x|ch|ss|sh|zz|tto|go|cho|alias|[^aou]us|tlas|gas|(?:her|at|gr)o|ris)(?:es)?$/i, '$1'],
    [/(analy|ba|diagno|parenthe|progno|synop|the|empha|cri)(?:sis|ses)$/i, '$1sis'],
    [/(movie|twelve|abuse|e[mn]u)s$/i, '$1'],
    [/(test)(?:is|es)$/i, '$1is'],
    [/(alumn|syllab|octop|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1us'],
    [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|quor)a$/i, '$1um'],
    [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)a$/i, '$1on'],
    [/(alumn|alg|vertebr)ae$/i, '$1a'],
    [/(cod|mur|sil|vert|ind)ices$/i, '$1ex'],
    [/(matr|append)ices$/i, '$1ix'],
    [/(pe)(rson|ople)$/i, '$1rson'],
    [/(child)ren$/i, '$1'],
    [/(eau)x?$/i, '$1'],
    [/men$/i, 'man']
  ].forEach(function (rule) {
    return pluralize.addSingularRule(rule[0], rule[1]);
  });

  /**
   * Uncountable rules.
   */
  [
    // Singular words with no plurals.
    'adulthood',
    'advice',
    'agenda',
    'aid',
    'alcohol',
    'ammo',
    'anime',
    'athletics',
    'audio',
    'bison',
    'blood',
    'bream',
    'buffalo',
    'butter',
    'carp',
    'cash',
    'chassis',
    'chess',
    'clothing',
    'cod',
    'commerce',
    'cooperation',
    'corps',
    'debris',
    'diabetes',
    'digestion',
    'elk',
    'energy',
    'equipment',
    'excretion',
    'expertise',
    'flounder',
    'fun',
    'gallows',
    'garbage',
    'graffiti',
    'headquarters',
    'health',
    'herpes',
    'highjinks',
    'homework',
    'housework',
    'information',
    'jeans',
    'justice',
    'kudos',
    'labour',
    'literature',
    'machinery',
    'mackerel',
    'mail',
    'media',
    'mews',
    'moose',
    'music',
    'manga',
    'news',
    'pike',
    'plankton',
    'pliers',
    'pollution',
    'premises',
    'rain',
    'research',
    'rice',
    'salmon',
    'scissors',
    'series',
    'sewage',
    'shambles',
    'shrimp',
    'species',
    'staff',
    'swine',
    'tennis',
    'traffic',
    'transporation',
    'trout',
    'tuna',
    'wealth',
    'welfare',
    'whiting',
    'wildebeest',
    'wildlife',
    'you',
    // Regexes.
    /[^aeiou]ese$/i, // "chinese", "japanese"
    /deer$/i, // "deer", "reindeer"
    /fish$/i, // "fish", "blowfish", "angelfish"
    /measles$/i,
    /o[iu]s$/i, // "carnivorous"
    /pox$/i, // "chickpox", "smallpox"
    /sheep$/i
  ].forEach(pluralize.addUncountableRule);

  return pluralize;
});

},{}],6:[function(require,module,exports){
!function(globals) {
'use strict'

var _imports = {}

if (typeof module !== 'undefined' && module.exports) { //CommonJS
  _imports.bytesToHex = require('convert-hex').bytesToHex
  _imports.convertString = require('convert-string')
  module.exports = sha256
} else {
  _imports.bytesToHex = globals.convertHex.bytesToHex
  _imports.convertString = globals.convertString
  globals.sha256 = sha256
}

/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/

// Initialization round constants tables
var K = []

// Compute constants
!function () {
  function isPrime(n) {
    var sqrtN = Math.sqrt(n);
    for (var factor = 2; factor <= sqrtN; factor++) {
      if (!(n % factor)) return false
    }

    return true
  }

  function getFractionalBits(n) {
    return ((n - (n | 0)) * 0x100000000) | 0
  }

  var n = 2
  var nPrime = 0
  while (nPrime < 64) {
    if (isPrime(n)) {
      K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3))
      nPrime++
    }

    n++
  }
}()

var bytesToWords = function (bytes) {
  var words = []
  for (var i = 0, b = 0; i < bytes.length; i++, b += 8) {
    words[b >>> 5] |= bytes[i] << (24 - b % 32)
  }
  return words
}

var wordsToBytes = function (words) {
  var bytes = []
  for (var b = 0; b < words.length * 32; b += 8) {
    bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF)
  }
  return bytes
}

// Reusable object
var W = []

var processBlock = function (H, M, offset) {
  // Working variables
  var a = H[0], b = H[1], c = H[2], d = H[3]
  var e = H[4], f = H[5], g = H[6], h = H[7]

    // Computation
  for (var i = 0; i < 64; i++) {
    if (i < 16) {
      W[i] = M[offset + i] | 0
    } else {
      var gamma0x = W[i - 15]
      var gamma0  = ((gamma0x << 25) | (gamma0x >>> 7))  ^
                    ((gamma0x << 14) | (gamma0x >>> 18)) ^
                    (gamma0x >>> 3)

      var gamma1x = W[i - 2];
      var gamma1  = ((gamma1x << 15) | (gamma1x >>> 17)) ^
                    ((gamma1x << 13) | (gamma1x >>> 19)) ^
                    (gamma1x >>> 10)

      W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
    }

    var ch  = (e & f) ^ (~e & g);
    var maj = (a & b) ^ (a & c) ^ (b & c);

    var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
    var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7)  | (e >>> 25));

    var t1 = h + sigma1 + ch + K[i] + W[i];
    var t2 = sigma0 + maj;

    h = g;
    g = f;
    f = e;
    e = (d + t1) | 0;
    d = c;
    c = b;
    b = a;
    a = (t1 + t2) | 0;
  }

  // Intermediate hash value
  H[0] = (H[0] + a) | 0;
  H[1] = (H[1] + b) | 0;
  H[2] = (H[2] + c) | 0;
  H[3] = (H[3] + d) | 0;
  H[4] = (H[4] + e) | 0;
  H[5] = (H[5] + f) | 0;
  H[6] = (H[6] + g) | 0;
  H[7] = (H[7] + h) | 0;
}

function sha256(message, options) {;
  if (message.constructor === String) {
    message = _imports.convertString.UTF8.stringToBytes(message);
  }

  var H =[ 0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A,
           0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19 ];

  var m = bytesToWords(message);
  var l = message.length * 8;

  m[l >> 5] |= 0x80 << (24 - l % 32);
  m[((l + 64 >> 9) << 4) + 15] = l;

  for (var i=0 ; i<m.length; i += 16) {
    processBlock(H, m, i);
  }

  var digestbytes = wordsToBytes(H);
  return options && options.asBytes ? digestbytes :
         options && options.asString ? _imports.convertString.bytesToString(digestbytes) :
         _imports.bytesToHex(digestbytes)
}

sha256.x2 = function(message, options) {
  return sha256(sha256(message, { asBytes:true }), options)
}

}(this);

},{"convert-hex":3,"convert-string":4}]},{},[1]);
