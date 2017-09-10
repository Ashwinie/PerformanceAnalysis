var executeBackground = function(){

    var backgroundpage = chrome.extension.getBackgroundPage();
    backgroundpage.invokeListener();
   
}

document.getElementById('generateReport').addEventListener('click', executeBackground);