// globals
var playlist_name = location.href.split('?')[1];
var port = chrome.runtime;
var last_check;

function getSongData(callback) {
  var playlist_url = 'http://somafm.com/songs/' + playlist_name + '.xml';
  $.get(playlist_url, function(data) {
    $xml = $(data),
    $playing = $xml.find("song").first(),
    artist = $playing.find("artist").text(),
    album = $playing.find("album").text(),
    title = $playing.find("title").text();
    
    var song = {
      artist: artist,
      album: album,
      title: title
    };
        
    callback(song);
  });
}

function updateFavStatus() {
  getSongData(function(data) {
    port.sendMessage({action: 'query', song: data});
  });
}

chrome.extension.onMessage.addListener(function(msg) {
  if (msg.action == 'add') {
    var bg = chrome.extension.getURL('assets/saved.png');
    $('#action')
      .css('background-image', 'url('+bg+')')
      .css('display', 'block')
      .addClass('saved');
  }
  else {
    var bg = chrome.extension.getURL('assets/not-saved.png');
    $('#action')
      .css('background-image', 'url('+bg+')')
      .css('display', 'block')
      .removeClass('saved');
  }
});

$('body').append('<div id="action">&nbsp;</div>');
$(document).on('click', '#action', function(e) {
  e.preventDefault();
  
  if($(this).hasClass('saved')) {
    getSongData(function(data) {
      port.sendMessage({action: 'remove', song: data});
    });
  }
  else {
    getSongData(function(data) {
      port.sendMessage({action: 'add', song: data});
    });
  }
});

// send a message right now to determine if the current song should be highlighted or not
updateFavStatus();

// schedule a check of the test url every so often; make the interval more frequent for more accuracy
setInterval(function() {
  var url = 'http://somafm.com/recent/'+playlist_name+'.test.html';
  $.get(url, function(data) {
    if(data != last_check) {
      updateFavStatus();
    }
    last_check = data;
  });
}, 5000);