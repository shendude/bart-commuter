//this file contains helper functions for the
//bart-commuter chrome extension, in no particular order

//xml getter function, calls bart api
//create new getter with new httpGet
//use by calling .get(uri, callback function) on getter
var httpGet = function() {
  this.get = function(myUrl, myCallback) {
    var myXml = new XMLHttpRequest();
    myXml.onreadystatechange = function() {
      if(myXml.readyState === XMLHttpRequest.DONE && myXml.status === 200)
        myCallback(myXml.responseXML);
    };
    myXml.open("GET", myUrl, true);
    myXml.send();
  };
};
