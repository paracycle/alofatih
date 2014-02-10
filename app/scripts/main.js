var queueCallback = null;
var isConnected = false;
var format = '.mp3';

var audioRoot = 'audio/';
var efendim = {
  src: 'efendim',
  transcript: 'Efendim?'
}
var ringback = 'ringback_tone';
var sounds = [
 { src: 'anladim-efeem', transcript: 'Anladım efendim...' },
 { src: 'anladim-efendim', transcript: 'Anladım efendim.' },
 { src: 'anlasilmistir-efeem', transcript: 'Anlaşılmıştır efendim....' },
 { src: 'anlasilmistir-efendim', transcript: 'Anlaşılmıştır efendim.' },
 { src: 'bizim-e-bizim-e-bizim-ayibimiz', transcript: 'Bizim, eee, bizim, eee bizim ayıbımız...' },
 { src: 'bu-bi-ayiptir', transcript: 'Bu bir ayıptır.' },
 { src: 'dogrudur-efendim', transcript: 'Doğrudur efendim' },
 { src: 'emriniz-olur', transcript: 'Emriniz olur' },
 { src: 'evdeydim-1-dakika-musaade-ederseniz', transcript: 'Evdeydim 1 dakika müsaade ederseniz efendim...' },
 { src: 'hic-hic-tereddut-yok-efeem', transcript: 'Hiç, hiç tereddüt yok efendim...' },
 { src: 'kestiriyorum-efendim', transcript: 'Kestiriyorum efendim.' },
 { src: 'simdi-2-3-dakikaya-kestiriyorum', transcript: 'Simdi; 2-3 dakikaya kestiriyorum.' },
 { src: 'tamam-efendim-simdi-kestiriyorum-efendim', transcript: 'Tamam efendim. Şimdi kestiriyorum efendim.' },
 { src: 'tamam-emriniz-olur-efeem', transcript: 'Tamam, emriniz olur efendim.' },
 { src: 'tekerrur-etmeyecektir-efendim', transcript: 'Tekerrür etmeyecek efendim.' },
];

if (!('webkitSpeechRecognition' in window)) {
  upgrade();
} else {
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;

  recognition.onstart = function() {
    isConnected = true;
    $('.call-button')
      .removeClass('start')
      .addClass('stop')
      .removeClass('btn-success')
      .addClass('btn-danger');

    ringback_player.stop();

    play(efendim);
    queueRandomAudio();
  }
  recognition.onresult = function(event) {
    var text = '';

    for (var i = event.resultIndex; i < event.results.length; ++i) {
      text += event.results[i][0].transcript;
    }

    transcript('SIZ', capitalize(text));
  }
  recognition.onerror = function(event) {
    console.log('Error: ', event);

    setTimeout(function() {
      startRecognition();
    }, 1000);
  }

  recognition.onend = function() {
    console.log('Ended')
  }
}

var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

function startRecognition() {
  stopRecognition();
  recognition.start();
}

function stopRecognition() {
  isConnected = false;
  recognition.stop();
  clearTimeout(queueCallback);
}

function transcript(speaker, text) {
  console.log(text);

  $('.transcript')
    .append(
      '<div class="transcript-line">' +
        '<span class="speaker">' + speaker + ' : -</span> ' +
        text +
      '</div>'
    );
}

function play(src) {
  if (src.src) {
    transcript("FATIH", src.transcript);
    src = src.src;
  }
  return new buzz.sound(audioRoot + src + format).play();
}

function playRandom() {
  var rand = sounds[Math.floor(Math.random() * sounds.length)];
  return play(rand);
}

function queueRandomAudio() {
  var timeout = (Math.random() * 4 + 5) * 1000;

  queueCallback = setTimeout(function () {
    if (!isConnected) {
      return;
    }
    playRandom();
    queueRandomAudio();
  }, timeout);
}


$('body').on('click', '.call-button.start', function (e) {
  ringback_player = play(ringback).loop();
  recognition.lang = 'tr-TR';
  recognition.start();
});

$('body').on('click', '.call-button.stop', function (e) {
  stopRecognition();

  $('.call-button')
    .addClass('start')
    .removeClass('stop')
    .addClass('btn-success')
    .removeClass('btn-danger');

});

