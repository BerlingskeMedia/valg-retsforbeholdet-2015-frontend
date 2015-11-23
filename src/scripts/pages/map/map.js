
app.controller("MapController", ["$scope", "$http", "$timeout", "tracker", function($scope, $http, $timeout, tracker){

  var doubleClickCheck = false;
  var enableMouseover = false;

  $scope.json = $scope.json || {};
  $scope.json.map = {};

  $scope.detectmobile = function(){
    if(navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
      return true;
    }else {
      return false;
    }
  };

  $scope.tickerCheck = function(){
    if((window.location != window.parent.location) || window.innerWidth <= 800){
      return false;
    }else {
      return true;
    }
  };


  $scope.toggleshowPer = function(value) {

    if(enableMouseover === false){
      return;
    }

    if(value === true || value === false){
      $scope.showPer = value
    } else if(!doubleClickCheck){
      doubleClickCheck = true;

      $scope.showPer = !$scope.showPer;

      $timeout(function(){
        doubleClickCheck = false
      }, 500);
    }
  };

  $scope.changeOrder = function(order) {
    if ($scope.order === order) {
      return $scope.reverse = !$scope.reverse;
    } else {
      $scope.order = order;
      return $scope.reverse = false;
    }

  };


  $http.get(apiIp+"/map").then(function(data){
    if(data.data) {
      $scope.json.map = data.data;
      if (data.data.results && data.data.results.JA.votes_pct + data.data.results.NEJ.votes_pct >= 95) {
        $scope.showPer = true;
        enableMouseover = true;
      }
    }
  }, function(data, status, headers, config){
    alert("Der var et problem med at skabe kontakt til vores server, prøv igen senere.");

  });

  //tracker.track();

}]);
