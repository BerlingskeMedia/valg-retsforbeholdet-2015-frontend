
app.controller("TeaserController", ["$scope", "$http", "$timeout", "$routeParams", "$location", function($scope, $http, $timeout, $routeParams, $location) {

  var doubleClickCheck = false;
  var enableMouseover = false;

  $scope.json = $scope.json || {};
  $scope.json.map = {};
  if ($routeParams.url === undefined) {
    $scope.appUrl = 'http://www.politiko.dk/retsforbeholdet/resultatet#/';
  } else {
    $scope.appUrl = "http://" + ($routeParams.url.replace('-', '/'));
  }

  $scope.toggleshowPer = function(value) {
    if (enableMouseover === false) {
      return;
    }
    if (value === true || value === false) {
      $scope.showPer = value;

    } else if (!doubleClickCheck) {
      doubleClickCheck = true;
      $scope.showPer = !$scope.showPer;

      $timeout(function() {
          doubleClickCheck = false;
        }, 500);
    }
  };

  $scope.tickerCheck = function(){
    var host = $location.$$host;
    if(host === "www.politiko.dk" && window.innerWidth <= 800){
      return true;
    }else if((window.self !== window.top) || window.innerWidth <= 800){
      return false;
    }else {
      return true;
    }
  };

  $scope.detectmobile = function(){
    if(navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
      return true;
    }else {
      return false;
    }
  };

  $http.get(apiIp + "/teaser").then(function(data) {
      if(data.data) {
        $scope.json.map = data.data;
        if (data.data.results && data.data.results.JA.votes_pct + data.data.results.NEJ.votes_pct >= 95) {
          $scope.showPer = true;
          enableMouseover = true;
        }
      }
    }, function(data, status, headers, config) {}
  );

}]);
