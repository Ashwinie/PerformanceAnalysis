var httprequestArray = [];


var sendHTTPInfo = function(request){
    console.log(request);
    httprequestArray.push(request);
    chrome.tabs.onUpdated.addListener(function (tabId , info, tab) {
       console.log(info.status);
       //count++;
        if (info.status === 'complete') {
         // if(count == 1) {  
              console.log("hello");
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                chrome.tabs.sendMessage(tabId, {content: httprequestArray}, function(response) {

                });  
             });
           // }
             chrome.webRequest.onCompleted.removeListener(sendHTTPInfo);
        }
      });  
}



  var invokeListener = function(){
    httprequestArray = [];
    chrome.webRequest.onCompleted.addListener(
      sendHTTPInfo,             
      {urls: ["<all_urls>"]}       
    );
  }   
    

    //   chrome.runtime.onMessage.addListener(
    //     function(request, sender, sendResponse) {
    //       console.log(sender.tab ?
    //                   "from a content script:" + sender.tab.url :
    //                   "from the extension");
    //       if (request.greeting == "hello")
    //         sendResponse({farewell: "goodbye"});
    //     });
     
