document.querySelector('#clear-all').onclick = function(e) {
  e.preventDefault();
  chrome.storage.sync.clear(function() {
    document.querySelector('#song-data').value = '';
  });
};

chrome.storage.sync.get(null, function(results) {
  var keys = Object.keys(results);
  if(keys.length > 0) {
    var data_string = '';
    for(i in keys) {
      var song = results[keys[i]];
      data_string += 'Artist: ' + song.artist + '\nAlbum: ' + song.album + '\nTitle: ' + song.title + '\n\n';
    }
    
    document.querySelector('#song-data').value = data_string;
  }
});
