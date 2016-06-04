window.onload = function() {

  //no strings attatched BART api key
  var key = "&key=ZM4P-PKYX-99KT-DWE9";

  //gets current time in hours, min
  var date = new Date();
  var time = [date.getHours(), date.getMinutes()];


  //default station 1 -> el cerrito plaza station
  var station1 = "PLZA";
  //default route for station 1 -> all northbound routes
  var route1 = [3, 8];

  //initializes DOM of extension
  //prevents outdated data from being seen
  var station1HTML = document.getElementById("station1");
  station1HTML.innerHTML = "Loading...";
  var st1InfoHTML = document.getElementById("st1Info");
  st1InfoHTML.innerHTML = "";
  var st1DeparturesHTML = document.getElementById("st1Departures");
  st1DeparturesHTML.innerHTML = "";

  //runs every time the extension is used
  //gets default one station @ el cerrito plaza, all northbound routes
  //unless user selected unique station, route
  //in which case, gets desired station-route info
  var newClient = new httpGet();
  newClient.get("http://api.bart.gov/api/sched.aspx?cmd=stnsched&orig=" + station1 + key, function(response) {
    station1HTML.innerHTML = response.getElementsByTagName("name")[0].childNodes[0].nodeValue;

    var departures = response.getElementsByTagName("item")
    for (i = 0; i < route1.length; i++) {
      console.log('hello');
    };
  });

};
