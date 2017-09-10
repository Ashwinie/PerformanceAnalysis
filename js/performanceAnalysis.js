var httpRequestsArray = [], checker = 0;
var DOMAnalysis = (function(){
    var config = {
        maxScore : 100
    }

    var getDomSize = function(){

        return document.getElementsByTagName('*').length;
    } 

    return {
        getDomSize : getDomSize
    }
})();



/*
   className : cookieAnalysis,
   return : function

*/
var cookieAnalysis = (function(){
    var config = {
        maxScore : 100,
        maxCookieSize : 1000
    }

    /*
        functionName : cookiePenalty,
        return : Object
    */
    var cookieInfo = function(cookie){
         let cookieSize = (cookie && cookie.length) || 0, message = '', status = false;
         
         if(cookieSize > config.maxCookieSize){
             message = " The cookie size is larger";
             status = true;
         }
         return {
             size : cookieSize,
             message : message,
             status : status
         }

    }
    return {
        cookieInfo : cookieInfo
    }
})();

/*
   className : CSSanalyser,
   return : function

   function : mininfiedCssPenalty

*/
var CSSanalyser = (function(){
    var config = {
       penaltyScore : 10,
       maxScore : 100

    }   
   
   
    /*
         functionName : mininfiedCssPenalty,
         return : Object
    */
    var mininfiedCssPenalty = function(cssHrefArray){  
      return new Promise (function(resolve, reject){
        let offenders = [];
        Promise.all(
        cssContentArray = cssHrefArray.map((cssRequest)=> {
                
                return  utils.retrieveContentForURL(cssRequest.url);
            })
        ).then(function (cssContentArray) {
            console.log(cssContentArray.length);
             for(let i = 0; i<cssContentArray.length ; i++){
                 console.log(cssContentArray[i].isSuccess);
               if(cssContentArray[i].isSuccess){
                    let isMinified = utils.verifyMinified(cssContentArray[i].content);
                    if(!isMinified)
                        offenders.push(content.url);     

               }  
            }
                   // console.log("off" + offenders.length);
                   penaltyScore =  (offenders.length > 0 ?config.maxScore - offenders.length * config.penaltyScore: config.maxScore);
                   return resolve({ penaltyScore : penaltyScore, offenders : offenders });
        });   
      });       
    }
    

    return { 
        mininfiedCssPenalty : mininfiedCssPenalty,
       
    }

})();

var jsAnalyser = (function(){

    var config = {
        penaltyScore : 10,
        maxScore : 100
 
     }  

    var mininfiedjsPenalty = function(jsSrcArray){
        return new Promise (function(resolve, reject){
            let offenders = [];
            Promise.all(
                jsContentArray = jsSrcArray.map((jsRequest)=> {
                    
                    return  utils.retrieveContentForURL(jsRequest.url);
                })
            ).then(function (jsContentArray) {
                console.log("content array" + jsContentArray.length);
                 for(let i = 0; i<jsContentArray.length ; i++){
                    console.log(jsContentArray[i].isSuccess);
                   if(jsContentArray[i].isSuccess){
                        let isMinified = utils.verifyMinified(jsContentArray[i].content);
                        if(!isMinified)
                            offenders.push(content.url);     
    
                   }  
                }
                penaltyScore =  (offenders.length > 0 ?config.maxScore - offenders.length * config.penaltyScore: config.maxScore);
                return resolve({ penaltyScore : penaltyScore, offenders : offenders });
            });   
        });       
        
    }

    return { 
       
        mininfiedjsPenalty : mininfiedjsPenalty
    }

})();
var HTTPrequestAnalyser = (function(){
    var components = {
    }
    var getComponentsByType = function(type){
        return httpRequestsArray.filter((request)=> request.type === type)
    }
    var gethttpRequestsInfo = function(){
        let requests = httpRequestsArray.length;
        //console.log(requests);
        let cssComponents = getComponentsByType('stylesheet');
        let scriptComponents = getComponentsByType('script');
        let imageComponents = getComponentsByType('image');
        let fontComponents = getComponentsByType('font');
        let mediaComponents = getComponentsByType('media');
        components.httpRequestInfo = requests;
        components.cssComponents = cssComponents;
        components.scriptComponents = scriptComponents;
        components.imageComponents = imageComponents;
        components.fontComponents = fontComponents;
        components.mediaComponents = mediaComponents;

        return components;
    }

    var checkScriptPosition = function(){
           let getAllScripts = document.getElementsByTagName('scripts');
            
           for(let i = 0;i<getAllScripts.length;i++){
                    
           }
    }

    return {
        gethttpRequestsInfo : gethttpRequestsInfo,
        scriptPositionInfo : checkScriptPosition
    }
})();


chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
   
 if(checker == 0){
    httpRequestsArray = msg.content;
    console.log(msg.content);
    checker = 1;
 }  

   
 });
window.onload = setTimeout(function (){

    var components = HTTPrequestAnalyser.gethttpRequestsInfo();
    console.debug("No of HTTPRequests: ",components);
   
   
    var cookieInfo = cookieAnalysis.cookieInfo(document.cookie);
    console.debug("Cookie Info: ",cookieInfo);
    
    
   var domSize = DOMAnalysis.getDomSize();
   console.debug(domSize);

   var minifiedCss = CSSanalyser.mininfiedCssPenalty(components.cssComponents).then(function(minifiedCssInfo){
    console.log("Minified css Info: ",minifiedCssInfo);    
   });

   var minifiedJs = jsAnalyser.mininfiedjsPenalty(components.scriptComponents).then(function(minifiedJsInfo){
    console.log("Minified js Info ",minifiedJsInfo);
   });

//    var checkJsPosition = jsAnalyser.scriptPositionInfo();
//    console.log("Js Position ",checkJsPosition);
},7000);



     
