app.directive('electionMap', ["$filter", "$location", "$rootScope", function($filter, $location, $rootScope) {
  return {
    restrict: "A",
    templateUrl: "/upload/tcarlsen/danish-election-2015-results/election-map.html",
    link: function(scope, element, attrs){
      var svg = d3.select("#dk_valgkredse");
      var tip = d3.tip()
        .attr("class", "map-tip")
        .html(function(data){
          var red = $filter('number')(data.red_block_votes_pct, 1);
          var blue = $filter('number')(data.blue_block_votes_pct, 1);
          var counted = $filter('number')(data.votes_counted_pct, 1);

          var html = "<h2 class=\"map-tip-header\">";
          html+= "<div class=\"map-tip-counted\">Optalt: </div>"; // removed #{counted}%
          html+= data.name+"</h2>";

          /*
           todo: setup tip content relevant to validated eu poll data
           if data.parties.length is 0
           html+= "<p>Afventer optælling fra kredsen.</p>"
           else
           html+= "<table class=\"map-tip-table striped\">"
           html+= "<tbody>"

           for party in data.parties
           percent = $filter('number')(party.votes_pct, 1)

           html+= "<tr>"
           html+= "<td><i class=\"partylogo #{party.party_letter}\"></i></td>"
           html+= "<td>#{party.party_name}</td>"
           html+= "<td class=\"number\">#{percent}%</td>"
           html+= "</tr>"

           html+= "</tbody>"
           html+= "</table>"

           if data.blue_block_votes_pct isnt 0
           html+= "<div class=\"map-tip-block\">"
           html+= "<div class=\"map-tip-red\">#{red}%</div>"
           html+= "<div class=\"map-tip-blue\" style=\"width:#{data.blue_block_votes_pct}%\">#{blue}%</div>"
           html+= "</div>"

           return html

           */

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

        /*
         for constituency in data
         mapId = constituency.ident.replace "K", "op-kreds-"

         svg.select "##{mapId}"
         .data [constituency]
         .attr "class", (d) -> "map #{classes(d.block_winner, d.votes_counted_pct)}"
         .on "mouseover", (d) ->
         d3.select(this).attr "class", "map selected"

         tipDirection = ''
         targetRect = this.getBBox()
         parentRect = svg[0][0].getBBox();

         if targetRect.y > parentRect.height / 2
         tipDirection = 'n'
         else
         tipDirection = 's'
         if targetRect.x > parentRect.width / 2
         tipDirection += 'w'
         else
         tipDirection += 'e'
         tip
         .direction tipDirection
         .show d
         .on "mouseout", (d) ->
         d3.select(this).attr "class", "map #{classes(d.block_winner, d.votes_counted_pct)}"
         tip.hide()
         .on "click", (d) ->
         tip.destroy()
         scope.$apply ->
         $location.path "resultater#{d.path}"
         */

      };

      var update = function(data){
        /*
         update = (data) ->
         mapId = data.ident.replace "K", "op-kreds-"
         ele = d3.select "##{mapId}"

         ele
         .data [data]
         .attr "class", "map updated"
         .transition(2000).delay(200)
         .attr "class", (d) -> "map #{classes(d.block_winner, d.votes_counted_pct)}"
         */
      };

      svg.call(tip);


      scope.$watchCollection("json.map.constituencies", function(data){
        if(data)
          render(data)
      });
      scope.$watchCollection("json.map.newConstituency", function(data){
        if(data)
          update(data)
      });

    }

  }

}]);
