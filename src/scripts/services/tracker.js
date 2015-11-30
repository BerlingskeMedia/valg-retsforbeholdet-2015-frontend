app.service("tracker", ["$location" ,function($location){
  return {
    track: function(){

      var host = $location.$$host;
      var url = $location.$$absUrl;
      var ref = document.referrer;

      if(host != "localhost"){
        var appId = "retsforbeholdet";
        var appPath = $location.$$path;

        if(url.split("retsforbeholdet_2015").length === 2) {
          var hostSlash = ref.match(/:\/\/(.[^/]+)/);
          if(ref.match(/:\/\/(.[^/]+)/) && ref.match(/:\/\/(.[^/]+)/).length > 1){
            host = hostSlash[0];
            host.replace("www.", "");
            host.replace(".dk", "").replace(".com", "").replace(".org", "");
          }
        }else {
          host = "politiko";
        }
        ga("send", "pageview", host + "-" + appId + "-" + appPath);
      }
    }
  }
}]);
