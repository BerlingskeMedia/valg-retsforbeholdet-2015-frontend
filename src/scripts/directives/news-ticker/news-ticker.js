app.directive('newsTicker',  function() {
  return {
    restrict: "A",
    template: "<div class='breaking' ng-class='{fadeout: news.fade, fadein: !news.fade}' ng-mouseover='news.active = true' ng-mouseout='news.active = false'>{{news.breaking}}</div>",
    bindToController: true,
    controllerAs: "news",
    controller: ["$http", "$interval", "$timeout", "$scope", function($http, $interval, $timeout, $scope){
      var news = this;

      var ticker;
      var tickInterval = 5000;

      news.breaking = "";
      news.fade = false;

      var startTicker  = function(list){
        var i = 0;
        ticker = $interval(function(){
          if(!news.active) {
            if (i === list.length - 1) {
              i = 0;
            }
            news.fade = true;
            $timeout(function () {
              news.breaking = "BREAKING: "+list[i].name;
              i++;
              $timeout(function () {
                news.fade = false;
              });
            }, 500);
          }
        }, tickInterval);

      };

      $http.get(apiIp + "/map").then(function(data) {
          if(data.data) {
            news.breakingList = data.data.locations;
            startTicker(news.breakingList);
          }
        }, function(data, status, headers, config) {}
      );

      //$scope.on("$destroy", function(){
      //  $interval.cancel(ticker, 0);
      //})
    }]
  }
});
