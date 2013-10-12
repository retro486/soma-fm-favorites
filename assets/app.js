chrome.extension.onMessage.addListener(function(data, sender) {
  if(data.action == 'add') addFavSong(data.song, sender.tab.id);
  else if(data.action == 'query') {
    
    var key = buildKey(data.song);
    chrome.storage.sync.get(key, function(results) {
      if(results[key] === undefined) chrome.tabs.sendMessage(sender.tab.id, {action: 'remove'});
      else chrome.tabs.sendMessage(sender.tab.id, {action: 'add'});
    });
  }
  else removeFavSong(data.song, sender.tab.id);
});

function buildKey(data) {
  return '' + data.artist + data.album + data.title;
}

function addFavSong(data, tab_id) {
  var key = buildKey(data);
  
  var o = {};
  o[key] = data;
  chrome.storage.sync.set(o, function() {
    chrome.tabs.sendMessage(tab_id, {action: 'add'});
  });
}

function removeFavSong(data, tab_id) {
  var key = buildKey(data);
  
  chrome.storage.sync.remove(key, function() {
    chrome.tabs.sendMessage(tab_id, {action: 'remove'});
  });
}
