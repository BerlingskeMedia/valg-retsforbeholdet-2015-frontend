app.service("tracker", ["$location" ,function($location){
  return {
    track: function(){

      var host = $location.$$host;
      var url = $location.$$absUrl;

      if(host != "localhost"){
        var appId = "retsforbeholdet";
        var appPath = $location.$$path;

        if(url.split("retsforbeholdet_2015").length === 2) {
          var hostHash = url.split("#");
          var hostSlash = hostHash[0].split("/");
          var hostHtml = hostSlash[hostSlash.length - 1].split(".html");
          host = hostHtml[0]
        }else {
          host = "politiko";
        }
        console.log({
          'pageview': host + "-" + appId + "/#" + appPath,
          'url': url
        });
        ga("send", "pageview", host + "-" + appId + "-" + appPath);
      }
    }
  }
}]);
