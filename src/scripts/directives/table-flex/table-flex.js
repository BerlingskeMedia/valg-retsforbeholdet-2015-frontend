app.directive('tableFlex', [ '$timeout', '$rootScope', function($timeout, $rootScope) {
  return {
    restrict : 'A',
    link : function(scope, element, attrs) {

      if(window.self === window.top) {
        // hot fix for politiko implementation without iframe
        $rootScope.$watch(function () {
          return window.innerWidth;
        }, function () {
          if(element[0].clientWidth < 800){
            $rootScope.forceMobileView = true;
          }else{
            $rootScope.forceMobileView = false;
          }
        });
      }
    }
  };
}]);
