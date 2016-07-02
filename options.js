//FIXME add loadoptions funciton

//writes station list to dropdown station selection menu
var getStations = function(targetHTML) {
  targetHTML.innerHTML = "";
  //Initializes xml http request
  var newClient = new httpGet();
  var uri = "http://api.bart.gov/api/stn.aspx?cmd=stns" + key;

  //xml http get and callback function to write that info to DOM
  //specifically: fills station drop down menu
  newClient.get(uri, function(response) {
    var arr = response.getElementsByTagName("station");
    var stationArr = [];
    for (var i = 0; i < arr.length; i++) {
      var name = arr[i].getElementsByTagName("name")[0].childNodes[0].nodeValue;
      var abbr = arr[i].getElementsByTagName("abbr")[0].childNodes[0].nodeValue;
      stationArr[i] = {name: name, abbr: abbr};
    };
    for (var i = 0; i < arr.length; i++) {
      var newElem = document.createElement("option");
      newElem.appendChild(document.createTextNode(stationArr[i].name));
      newElem.setAttribute("value", stationArr[i].abbr);
      targetHTML.appendChild(newElem);
    };
  });
};


//writes selectable route info into DOM after selecting station
var getRoutes = function(myStation, nbHTML, sbHTML) {

  nbHTML.innerHTML = "Northbound Trains:";
  sbHTML.innerHTML = "Southbound Trains:";

  //Initializes xml http request
  var newClient = new httpGet();
  var uri = "http://api.bart.gov/api/stn.aspx?cmd=stninfo&orig=" + myStation + key;

  //xml http get and callback function to write that info to DOM
  //specifically: fills route checkbox section
  newClient.get(uri, function(response) {

    var nRoutes = nodeArray(response.getElementsByTagName("north_routes")[0].childNodes);
    var sRoutes = nodeArray(response.getElementsByTagName("south_routes")[0].childNodes);

    writeChkbox(nRoutes, nbHTML);
    writeChkbox(sRoutes, sbHTML);
  });
};

//assigns DOM event listeners for options page
var writeListeners = function() {
  document.getElementById("st1Input").addEventListener("change", selectStation1, false);
  document.getElementById("st2Input").addEventListener("change", selectStation2, false);
  document.getElementById("st2overlay").addEventListener("click", st2fade, false);
  document.getElementById("close").addEventListener("click", st2fade, false);

  var routeArr = ["st1nb", "st1sb", "st2nb", "st2sb"];
  for (var i = 0; i < routeArr.length; i++) {
    document.getElementById(routeArr[i]).addEventListener("mouseover", unfade, false);
    document.getElementById(routeArr[i]).addEventListener("mouseout", fade, false);
    document.getElementById(routeArr[i]).addEventListener("click", routeClick, false);
  };
};

//controls action upon selecting station from drop down menu
//resets settings, fadesettings for new selected station
var selectStation1 = function() {
  mySettings.st1 = document.getElementById("st1Input").value;
  mySettings.st1nb = [];
  mySettings.st1sb = [];
  document.getElementById("st1nb").className = "fade";
  fadeSettings.st1nb = true;
  document.getElementById("st1sb").className = "fade";
  fadeSettings.st1sb = true;
  getRoutes(document.getElementById("st1Input").value, document.getElementById("st1nb"), document.getElementById("st1sb"));
};
var selectStation2 = function(){
  mySettings.st2 = document.getElementById("st2Input").value;
  mySettings.st2nb = [];
  mySettings.st2sb = [];
  document.getElementById("st2nb").className = "fade";
  fadeSettings.st2nb = true;
  document.getElementById("st2sb").className = "fade";
  fadeSettings.st2sb = true;
  getRoutes(document.getElementById("st2Input").value, document.getElementById("st2nb"), document.getElementById("st2sb"));
};


//controls fading by looking up fadeSettings obj
//class definitiions in options css file
var fade = function() {
  if (fadeSettings[this.id] === true) {
    this.className = "fade";
  };
};
var unfade = function() {
  this.className = "unfade";
};
//toggles fade overlay covering station 2 section
var st2fade = function() {
  if (fadeSettings.st2 === true) {
    document.getElementById("st2overlay").style.visibility = "hidden";
    document.getElementById("station2").style.opacity = "1";
    fadeSettings.st2 = false;
    mySettings.useSt2 = true;
  } else {
    document.getElementById("st2overlay").style.visibility = "visible";
    document.getElementById("station2").style.opacity = "0.5";
    fadeSettings.st2 = true;
    mySettings.useSt2 = false;
  };
};

//on click adds route info to my setting object
//this function writes fade info for routes
var routeClick = function() {
  var arr = this.childNodes;
  var newArr = [];
  for (var i = 1; i < arr.length; i++) {
    if (arr[i].childNodes[0].checked) {
      newArr.push(arr[i].childNodes[0].id);
    };
  };
  if (newArr.length > 0) {
    mySettings[this.id] = newArr;
    fadeSettings[this.id] = false;
  } else {
    fadeSettings[this.id] = true;
  };
};

//load default values and events to improve readability FIXME load defaults only if no settings saved
window.onload = function() {
  getStations(document.getElementById("st1Input"));
  getRoutes("12TH", document.getElementById("st1nb"), document.getElementById("st1sb"));
  writeListeners();
};
