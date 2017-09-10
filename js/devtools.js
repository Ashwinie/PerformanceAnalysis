

alert("dev here");
    chrome.devtools.network.getHar(function(details) {
       console.log(details.entries);
    });




