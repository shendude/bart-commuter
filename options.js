window.onload = function() {
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

  var selectRoutes = function() {
    if (document.getElementById("st1Input").value) {
      console.log("hello world");
    };
  };

  //saves user slected stations, routes, alarm info
  var save = function() {
    //FIXME
  };

  getStations(document.getElementById("st1Input"));
  //FIXME only activate when user selects station
  getRoutes("12TH", document.getElementById("st1nb"), document.getElementById("st1sb"));
};
