app.service("tracker", ["$location" ,function($location){
  return {
    track: function(){

      var host = $location.$$host;
      var url = $location.$$absUrl;

      if(host != "localhost"){
        var appId = "valgresultat";
        var appPath = $location.$$path;

        if(url.split("upload").length === 2) {
          var hostHash = url.split("#");
          var hostSlash = hostHash[0].split("/");
          var hostHtml = hostSlash[hostSlash.length - 1].split(".html");
          host = hostHtml[0]
        }else {
          host = "politiko";
        }
        ga("send", "pageview", host + "-" + appId + "/#" + appPath);
      }
    }
  }
}]);
