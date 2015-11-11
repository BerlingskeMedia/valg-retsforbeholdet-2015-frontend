app.directive('blockPoll', ["$window", "$filter", function($window, $filter) {
  return {
    restrict: "A",
    link: function(scope, element, attrs){
      var firstRun = true;
      var redBlockValue = null;
      var blueBlockValue = null;
      var svgWidth = null;

      var svg = d3.select(element[0]).append("svg")
        .attr("width", "100%")
        .attr("height", "100%");


      var render = function(data){

        var blueBlockLetters, blueBlockRect, redBlockLetters, redBlockRect, svgHeight, xScale, xTotal;
        if (data.results.JA.votes_pct === null  || data.results.NEJ.votes_pct === null ) {
          return;
        }
        svgWidth = d3.select(element[0])[0][0].offsetWidth;
        svgHeight = d3.select(element[0])[0][0].offsetHeight;
        xTotal = data.results.JA.votes_pct + data.results.NEJ.votes_pct;
        if (xTotal === 0) {
          xTotal = 2;
        }
        xScale = d3.scale.linear().domain([0, xTotal]).range([0, svgWidth]);
        redBlockRect = svg.selectAll(".red.block-rect").data([data.results.JA]);
        redBlockRect.enter().append("rect").attr("class", "red block-rect").attr("height", svgHeight).attr("width", 0).attr("y", 0).attr("x", 0);
        redBlockRect.transition().duration(1000).attr("width", function(d) {
            if (d.votes_pct === 0 && xTotal === 2) {
              return xScale(1);
            } else {
              return xScale(d.votes_pct);
            }
          }
        );
        redBlockValue = svg.selectAll(".red.block-value").data([data.results.JA]);
        redBlockValue.enter().append("text").attr("class", "red block-value").attr("x", 10).attr("y", 38).attr("text-anchor", "start");
        redBlockValue.text(function(d) {
            return ($filter('number')(d.votes_pct)) + "%";
          }
        );
        redBlockLetters = svg.selectAll(".red.block-letters").data([data.results.JA]);
        redBlockLetters.enter().append("text").attr("class", "red block-letters").attr("y", 38).attr("text-anchor", "end");
        redBlockLetters.text(function(d) {
            return d.party_letters;
          }
        ).transition().duration(1000).attr("x", function(d) {
            return xScale(d.votes_pct) - 10;
          }
        );
        blueBlockRect = svg.selectAll(".blue.block-rect").data([data.results.NEJ]);
        blueBlockRect.enter().append("rect").attr("class", "blue block-rect").attr("height", svgHeight).attr("width", 0).attr("y", 0).attr("x", svgWidth);
        blueBlockRect.transition().duration(1000).attr("x", function(d) {
            if (d.votes_pct === 0 && xTotal === 2) {
              return svgWidth - xScale(1);
            } else {
              return svgWidth - xScale(d.votes_pct);
            }
          }
        ).attr("width", function(d) {
            if (d.votes_pct === 0 && xTotal === 2) {
              return xScale(1);
            } else {
              return xScale(d.votes_pct);
            }
          }
        );
        blueBlockValue = svg.selectAll(".blue.block-value").data([data.results.NEJ]);
        blueBlockValue.enter().append("text").attr("class", "blue block-value").attr("x", svgWidth - 10).attr("y", 38).attr("text-anchor", "end");
        blueBlockValue.text(function(d) {
            return ($filter('number')(d.votes_pct)) + "%";
          }
        );
        blueBlockLetters = svg.selectAll(".blue.block-letters").data([data.results.NEJ]);
        blueBlockLetters.enter().append("text").attr("class", "blue block-letters").attr("y", 38).attr("text-anchor", "start");
        blueBlockLetters.text(function(d) {
            return d.party_letters;
          }
        ).transition().duration(1000).attr("x", function(d) {
            return svgWidth - xScale(d.votes_pct) + 10;
          }
        );
        if (svgWidth <= 780) {
          redBlockLetters.attr("display", "none");
          blueBlockLetters.attr("display", "none");
          redBlockValue.text(function(d) {
              return ($filter('number')(d.votes_pct)) + "%";
            }
          );
          return blueBlockValue.text(function(d) {
              return ($filter('number')(d.votes_pct)) + "%";
            }
          );
        }
      };

      $window.onresize = function(){
        scope.$apply();
      };

      scope.$watch(function(){
          return angular.element($window)[0].innerWidth;
        },function(){
          if(firstRun){
            return
          }
          svg.selectAll("*").remove();
          render(scope.json.map);
        }
      );

      scope.$watchCollection("json.map.results", function(data) {
        if(data){
          firstRun = false;
          render(scope.json.map);
        }
      });

      scope.$watch("showPer", function(data){
        if(data === false) {

          redBlockValue.text(function(d){
            return "JA";
          });
          blueBlockValue.text(function(d) {
            return "NEJ"
          });

        }else if(data === true) {


          redBlockValue.text(function(d){
            return d.votes_pct+"%";
          });
          blueBlockValue.text(function(d) {
            return d.votes_pct+"%";
          });
        }
      });

    }
  }

}]);
