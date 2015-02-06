(function () {
  angular
    .module('app.search', [
      'ui.router',
      'directives.frames',
      'directives.branch',
      'app.firm'
    ])

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider) {
      $stateProvider.state('main.search', {
        url: 'search/:query',
        controller: 'SearchCtrl',
        templateUrl: 'search/search.tpl.html'
      });
    }])

    .controller('SearchCtrl', ['$scope', '$injector', '$stateParams', 'leafletData', 'BranchesFeed',
      function ($scope, $injector, $stateParams, leafletData, BranchesFeed) {

        if (!$stateParams.query) {
          $injector.get('$location').path('/');
          return;
        }
        $scope.$parent.query = $stateParams.query;

        $scope.feed = new BranchesFeed($stateParams.query);

        var $state = $injector.get('$state');
        var globalState = $injector.get('globalState');
        $scope.openBranch = function (branch) {
          globalState.branch = branch;
          $state.go('main.search.firm', {firm_id: branch.id});
        };
        var map;

        leafletData.getMap().then(function(m) {
          map = m;
        });

        $scope.feed.onMarkers = function(res) {
          var m, marker, iconEl;
          var res_markers = res.markers;
          var tmp = [];
          for (var i = 0; i < res_markers.length; i++) {
            m = res_markers[i];
            marker = L.marker(L.latLng(m.lat, m.lon), {
              icon: markerIcon
              //title: m.name
            });
            marker.paid = m.paid;
            marker.branch_id = m.branch_id;
            marker.html_title = '<div>' + m.name + '</div>';
            if (m.attributes && m.attributes.length) {
              var attrs = [];
              for (var j = 0; j < m.attributes.length && j < 3; j++) {
                attrs.push(m.attributes[j].name);
              }
              marker.html_title += '<ul><li>' + attrs.join('</li><li>') + '</li></ul>';
            }
            tmp.push(marker);
          }
          var group = new L.BranchClusterGroup({
            singleMarkerMode: false
          });
          group.addLayers(tmp);
          map.addLayer(group);

          group.on('click', function(e) {
            var m = e.layer;
            if (m && m.branch_id) {
              $state.go('main.search.firm', {firm_id: m.branch_id});
            }
          });
        };
      }])
  ;
})();
