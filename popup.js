window.onload = function() {
  //create DOM element pointers for h3 name elem., p station info elem., and ul departures
  var st1HTML = {name: document.getElementById("st1Name"), info: document.getElementById("st1Info"), departures: document.getElementById("st1Departures")};
  var st2HTML = {name: document.getElementById("st2Name"), info: document.getElementById("st2Info"), departures: document.getElementById("st2Departures")};

  //initializes DOM to default state
  st1HTML.name.innerHTML = "Loading...";
  st1HTML.info.innerHTML = "";
  st1HTML.departures.innerHTML = "";
  st2HTML.name.innerHTML = "Loading...";
  st2HTML.info.innerHTML = "";
  st2HTML.departures.innerHTML = "";


  //gets station, route info. displays it on DOM
  var getStation = function(st, stHTML) {
    //Initializes xml http request
    var newClient = new httpGet();
    var uri = "http://api.bart.gov/api/sched.aspx?cmd=stnsched&orig=" + st.name + key + "&date=today";

    //xml http get and callback function to that info to DOM
    newClient.get(uri, function(response) {

      //writes name of bart station to DOM
      stHTML.name.innerHTML = response.getElementsByTagName("name")[0].childNodes[0].nodeValue;

      //gets next 5 requested departures
      var arr = response.getElementsByTagName("item");
      var departures = [];
      for (var i = 0; i < arr.length; i++) {
        departures[i] = {route:arr[i].getAttribute("line"), time:arr[i].getAttribute("origTime")};
      };
      var myDepartures = departures.filter(function(elem) {
        return ((st.route.includes(elem.route)) && (checkTime(elem.time)));
      }).slice(0, 5);

      //writes departures to DOM unordered list, incl tooltip on route depar - dest
      for (var i = 0; i < myDepartures.length; i++) {
        var elem = document.createElement("li");
        elem.innerHTML = deltaTime(myDepartures[i].time) + "  mins";
        elem.className = shortName(myDepartures[i].route) + " tooltip";
        var tooltipText = document.createElement("span");
        tooltipText.innerHTML = routes[myDepartures[i].route];
        tooltipText.className = "tooltiptext";
        elem.appendChild(tooltipText);
        stHTML.departures.appendChild(elem);
      };

      //writes bound info to DOM
      switch(st.bound) {
        case 0:
          stHTML.info.innerHTML = "No Routes Selected";
          break;
        case 1:
          stHTML.info.innerHTML = "Northbound Routes";
          break;
        case 2:
          stHTML.info.innerHTML = "Southbound Routes";
          break;
        case 3:
          stHTML.info.innerHTML = "Northbound and Southboud";
          break;
      };
      if ((myDepartures.length === 0) && (st.bound != 0)) {
        stHTML.info.innerHTML = "Selected routes not running at this time";
      };

    });
  };

  //runs upon opening app, fills in DOM with route info
  load(function() {
    var st1 = {name: mySettings.st1, bound: compArr(mySettings.st1nb, mySettings.st1sb),
               route: mySettings.st1nb.concat(mySettings.st1sb)};
    getStation(st1, st1HTML);
    if (!fadeSettings.st2) {
      document.getElementById("st2").style.display = "block";
      var st2 = {name: mySettings.st2, bound: compArr(mySettings.st2nb, mySettings.st2sb),
               route: mySettings.st2nb.concat(mySettings.st2sb)};
      getStation(st2, st2HTML);
    } else {
      document.getElementById("st2").style.display = "none";
    }
  });
};

