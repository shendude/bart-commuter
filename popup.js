//no strings attatched BART api key
var key = "ZM4P-PKYX-99KT-DWE9";

var httpGet = function() {
  this.get = function(myUrl, myCallback) {
    var myXml = new XMLHttpRequest();
    myXml.onreadystatechange = function() {
      if(myXml.readyState === XMLHttpRequest.DONE && myXml.status === 200)
        myCallback(myXml.responseText);
    };
    myXml.open("GET", myUrl, true);
    myXml.send();
  };
};
