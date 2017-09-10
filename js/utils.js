var utils = (function(){
    
    var retrieveContentForURL = function(url){
        return new Promise(function(resolve, reject){
            $.get(url, function(res, status){
                return resolve({content : res, isSuccess : true, url : url});
              })
              .fail(function(err) {
                return resolve({content : err, isSuccess : false, url : url}); // Resolve this explicitly to get the complete data set
              });   
    });
    }
    var verifyMinified = function(content){
        let len = content.length;
        let striplen = content.replace(/\n| {2}|\t|\r/g, '').length;
        if (len === 0) { 
            return true;
        }

        striplen = content.replace(/\n| {2}|\t|\r/g, '').length; 
        //console.log((len-striplen)/len);
        if (((len - striplen) / len) > 0.2) { 
            return false;
        }

        return true;

    }
    return {
        retrieveContentForURL : retrieveContentForURL,
        verifyMinified : verifyMinified
    }
})();