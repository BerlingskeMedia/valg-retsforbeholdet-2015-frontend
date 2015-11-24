app.directive('newsTicker',  function() {
  return {
    restrict: "A",
    //template: "<div class='breaking' ng-class='{fadeout: news.fade, fadein: !news.fade}' ng-mouseover='news.active = true' ng-mouseout='news.active = false' ng-bind-html='news.breaking'></div>",
    template: "<div class='flip-container' ng-mouseover='news.active = true' ng-mouseout='news.active = false'>"+
                "<div class='flipper' ng-class='{flip: news.fade}'>"+
                  "<div class='front' ng-bind-html='news.breaking'></div>"+
                  "<div class='back'></div>"+
                "</div>"+
              "</div>",
    bindToController: true,
    controllerAs: "news",
    controller: ["$http", "$interval", "$timeout", "$scope", function($http, $interval, $timeout, $scope){
      var news = this;

      var ticker;
      var tickInterval = 5000;
      var firstRun = true;

      news.breaking = "";
      news.fade = false;

      var startTicker  = function(list){
        var i = 1;

        if(firstRun){
          news.fade = !news.fade;
          $timeout(function () {
            news.breaking = list[0];
            news.fade = !news.fade;
          }, 700);
          firstRun = false;
          startTicker(list);
        }else {
          ticker = $interval(function () {
            if (!news.active) {
              if (i === list.length - 1) {
                i = 0;
              }
              news.fade = !news.fade;
              $timeout(function () {
                news.breaking = list[i];
                i++;
                news.fade = !news.fade;
              }, 700);
            }
          }, tickInterval);
        }
      };

      $http.get(apiIp + "/newsticker").then(function(data) {
          if(data.data) {
            news.breakingList = data.data;
            startTicker(news.breakingList);
          }
        }, function(data, status, headers, config) {}
      );


    }]
  }
});
