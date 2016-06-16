window.onload = function() {
  //FIXME
  var getStations = function(targetHTML) {
    targetHTML.innerHTML = "";
    //Initializes xml http request
    var newClient = new httpGet();
    var uri = "http://api.bart.gov/api/stn.aspx?cmd=stns" + key;

    //xml http get and callback function to that info to DOM
    //specifically: fills station drop down menu
    newClient.get(uri, function(response) {

    });
  };

  var getRoutes = function(myStation) {

  };

  var save = function() {
    var mySt1 = document.getElementById("st1Input").value;
  };
};
