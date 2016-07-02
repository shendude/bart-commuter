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

//these objects are saved by the options file
var mySettings = {useSt2: false, useDefault: true, st1: "", st2: "", st1nb: [], st1sb: [], st2nb: [], st2sb: []};
var fadeSettings = {st1nb: true, st1sb: true, st2nb: true, st2sb: true, st2: true};

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

//given a route id in format "route xx" returns interger value of route
var routeInt = function(str) {
  return parseInt(str.split(" ").slice(1, 2)[0]);
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

//given a nodelist containing values, returns an array of those values
//also removes first blankspace if there is one
var nodeArray = function(nodeList) {
  var arr = [];
  for (var i = 0; i < nodeList.length; i++) {
    arr[i] = nodeList[i].childNodes[0].nodeValue;
    if (arr[i][0] === " ") {
      arr[i] = arr[i].slice(1);
    };
  };
  return arr;
};

//returns an object containing route names matched to their route ID's
//in addition to object containing route names matched to their colors
//routes points to dictionary of route ids to full route names
//routecolors points to dictionary of route ids to associated colors -> refrence bart map
var routeTable = function() {
  var newClient = new httpGet();
  var uri = "http://api.bart.gov/api/route.aspx?cmd=routes" + key;
  var myRoutes = {};
  var myRoutesColors = {};

  //xml http get and callback function to write that info to myRoutes object
  newClient.get(uri, function(response) {
    var arr = response.getElementsByTagName("route");
    var rName;
    var rId;
    var rColor;
    for (var i = 0; i < arr.length; i++) {
      rName = arr[i].getElementsByTagName("name")[0].childNodes[0].nodeValue;
      rId = arr[i].getElementsByTagName("routeID")[0].childNodes[0].nodeValue;
      rColor = arr[i].getElementsByTagName("color")[0].childNodes[0].nodeValue;
      myRoutes[rId] = rName;
      myRoutesColors[rId] = rColor;
    };
  });
  return [myRoutes, myRoutesColors];
};
var routeTableResults = routeTable();
var routes = routeTableResults[0];
var routeColors = routeTableResults[1];

//writes a given array to a HTML element with checkboxes and labels
var writeChkbox = function(arr, tarHTML) {
  for (var i = 0; i < arr.length; i++) {
    var newElem = document.createElement("label");
    var newElem2 = document.createElement("input");
    newElem2.setAttribute("type", "checkbox");
    newElem2.setAttribute("id", arr[i]);

    newElem.appendChild(newElem2);
    newElem.appendChild(document.createTextNode(routes[arr[i]]));
    tarHTML.appendChild(newElem);
  };
};

//saves user slected stations, routes, alarm info
var save = function() {
  //FIXME
};

