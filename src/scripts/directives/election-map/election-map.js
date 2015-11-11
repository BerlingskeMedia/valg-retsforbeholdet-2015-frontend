app.directive('electionMap', ["$filter", "$location", "$rootScope", function($filter, $location, $rootScope) {
  return {
    restrict: "A",
    templateUrl: "/upload/tcarlsen/danish-election-2015-results/election-map.html",
    link: function(scope, element, attrs){
      var svg = d3.select("#dk_valgkredse");
      var tip = d3.tip()
        .attr("class", "map-tip")
        .html(function(data){
          var red = $filter('number')(data.results.JA.votes_pct, 1);
          var blue = $filter('number')(data.results.NEJ.votes_pct, 1);
          var counted = $filter('number')(data.votes_pct, 1);

          var html = "<h2 class=\"map-tip-header\">";
          html += data.name + "</h2>";
          if (data.status_code === 0) {
            html += "<p>Afventer optælling fra kredsen.</p>";
          } else {
            html += "<table class=\"map-tip-table striped\">";
            html += "<tbody>";
            html += "<tr>";
            html += "<td>Stemmeberettigede</i></td>";
            html += "<td class=\"number\">"+data.votes_allowed+"</td>";
            html += "</tr>";
            html += "<tr>";
            html += "<td>Ja-stemmer</i></td>";
            html += "<td class=\"number\">"+data.results.JA.votes+"</td>";
            html += "</tr>";
            html += "<tr>";
            html += "<td>Nej-stemmer</i></td>";
            html += "<td class=\"number\">"+data.results.NEJ.votes+"</td>";
            html += "</tr>";
            html += "<tr>";
            html += "<td>Ugyldige stemmer</i></td>";
            html += "<td class=\"number\">"+data.votes_invalid_total+"</td>";
            html += "</tr>";
            html += "<tr>";
            html += "<td>Blanke stemmer</i></td>";
            html += "<td class=\"number\">"+data.votes_invalid_blank+"</td>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
          }
          if (data.blue_block_votes_pct !== 0) {
            html += "<div class=\"map-tip-block\">";
            html += "<div class=\"map-tip-red\">" + red + "%</div>";
            html += "<div class=\"map-tip-blue\" style=\"width:" + data.results.NEJ.votes_pct + "%\">" + blue + "%</div>";
            html += "</div>";
          }

          return html;
        });

      // function for setting map color-classes depending on poll results
      // todo: setup correct color mapping classes for map view (not red/blue)
      var classes = function (block, pct){
        if(block === "JA"){

          return "red";
          /*
           return "red" if pct >= 99.9
           return "light-red" if pct >= 50
           return "lighter-red"
           */

        }else if(block === "Nej"){

          return "blue";
          /*
           return "blue" if pct >= 99.9
           return "light-blue" if pct >= 50
           return "lighter-blue"
           */
        }else{
          return "neutral";
        }

      };

      var render = function(data){

        angular.forEach(data, function(constituency){
          // match constituency.ident to map id eg. op-kreds- + XX
          var mapId = "op-kreds-"+constituency.ident;
          //var mapId = constituency.ident.replace("K", "op-kreds-");

          svg.select("#" + mapId).data([constituency])
            .attr("class", function(d) {
              return "map " + (classes(d.winner, d.status_code));
            })
            .on("mouseover", function(d) {
              var parentRect, targetRect, tipDirection;
              d3.select(this).attr("class", "map selected");
              tipDirection = '';
              targetRect = this.getBBox();
              parentRect = svg[0][0].getBBox();
              if (targetRect.y > parentRect.height / 2) {
                tipDirection = 'n';
              } else {
                tipDirection = 's';
              }
              if (targetRect.x > parentRect.width / 2) {
                tipDirection += 'w';
              } else {
                tipDirection += 'e';
              }
              return tip.direction(tipDirection).show(d);
            })
            .on("mouseout", function(d) {
              d3.select(this).attr("class", "map " + (classes(d.winner, d.status_code)));
              return tip.hide();
            })
            .on("click", function(d) {
              tip.destroy();
              return scope.$apply(function() {
                  return $location.path("resultater" + d.path);
                });
            });

        });

      };

      svg.call(tip);

      scope.$watchCollection("json.map.constituencies", function(data){
        if(data)
          render(data)
      });


    }

  }

}]);
