//this file contains various helper functions for the
//bart-commuter chrome extension, in no particular order

//no strings attatched BART api key
var key = "&key=ZM4P-PKYX-99KT-DWE9";

//gets system time into array of ints
var time;
var refreshTime = function(){
  var date = new Date();
  time = [date.getHours(), date.getMinutes()];
};


//xml http request constructor, calls bart api
//create new getter when you construct httpGet
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

//turns a string of x:xx xx or xx:xx xx into a two number array
//returns that array
var parseTime = function(str) {
  var arr = str.split(/\W+/);
  arr[0] = parseInt(arr[0]);
  arr[1] = parseInt(arr[1]);
  if (arr[0] < 12) {
    if (arr[2] === "PM") {
      arr[0] += 12;
    };
  } else if (arr[2] === "AM") {
    arr[0] = 0;
  };
  return[arr[0], arr[1]];
};

//given a target time string, returns time till then in min
var deltaTime = function(str){
  refreshTime();
  var destTime = parseTime(str);
  if (destTime[0] < 2) {
    destTime[0] = destTime[0] + 24;
  };
  if (time[0] < 2) {
    time[0] = time[0] + 24;
  };
  return (((destTime[0] - time[0]) * 60) + destTime[1] - time[1]);
};

//checks if bart departure is later than current time,  uses parseTime function
//assumes business day for bart will end by 2am, resets both time counters after 2am
//returns true only if bart departure will happen after current time
var checkTime = function(str) {
  refreshTime();
  var destTime = parseTime(str);
  if (destTime[0] < 2) {
    destTime[0] = destTime[0] + 24;
  };
  if (time[0] < 2) {
    time[0] = time[0] + 24;
  };

  if (time[0] < destTime[0]) {
    return true;
  } else if ((time[0] === destTime[0]) && (time[1] < destTime[1])) {
    return true;
  } else {
    return false;
  };
};
