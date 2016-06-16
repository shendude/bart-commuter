window.onload = function() {

  //station 1 default departure station, routes
  var st1 = {name: "PLZA", bound: 1, route: [3, 8]};

  //create DOM element pointers for h3 name elem., p station info elem., and ul departures
  //FIXME: make st2
  var st1HTML = {name: document.getElementById("st1Name"), info: document.getElementById("st1Info"), departures: document.getElementById("st1Departures")};

  //initializes DOM to default state
  st1HTML.name.innerHTML = "Loading...";
  st1HTML.info.innerHTML = "";
  st1HTML.departures.innerHTML = "";


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
        var routeInt = function() {
          return parseInt(arr[i].getAttribute("line").slice(-1));
        };
        departures[i] = {route:routeInt(), time:arr[i].getAttribute("origTime")};
      };
      var myDepartures = departures.filter(function(elem) {
        return (st.route.includes(elem.route) && (checkTime(elem.time)));
      }).slice(0, 5);

      //writes departures to DOM unordered list
      //FIXME add mouseover tooltips!!! for route info, station info
      for (var i = 0; i < myDepartures.length; i++) {
        var elem = document.createElement("li");
        elem.innerHTML = deltaTime(myDepartures[i].time) + "  mins";
        elem.className = "route" + myDepartures[i].route;
        stHTML.departures.appendChild(elem);
      };

      console.log(myDepartures);
    });
  };

  getStation(st1, st1HTML);
};

