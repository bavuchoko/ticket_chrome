const script = document.createElement('script');
script.src = chrome.runtime.getURL('ticketer.js');
script.onload = function () {
  script.remove();};
(document.head || document.documentElement).appendChild(script);
