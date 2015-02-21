import {smallIcon, markerIcon, paidIcon} from '../../common/extra/BranchClusterGroup.js';

export default angular
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

  .controller('SearchCtrl', function ($scope, $injector, $stateParams, $window, leafletData, flux, $timeout,
                                      BranchActions, BranchStore, MarkerStore, SelectedBranchStore) {
    if (!$stateParams.query) {
      $injector.get('$location').path('/');
      return;
    }

    var query = decodeURIComponent($stateParams.query);
    var params = {
      q: query,
      limit: 20,
      start: -20
    };

    var $state = $injector.get('$state');
    $scope.openBranch = function (branch) {
      $scope.selectedId = branch.id;
      $state.go('main.search.firm', {firm_id: branch.id});
    };

    $scope.$emit('search.query', query);

    $scope.eof = false;
    $scope.count = 0;
    $scope.branches = [];
    $scope.selectedId = SelectedBranchStore.getSelectedId();

    $scope.$listenTo(BranchStore, function () {
      $scope.branches = BranchStore.getBranches();
      $scope.count = BranchStore.getCount();
      $scope.eof = BranchStore.isEof();
    });

    var cluster = new L.BranchClusterGroup({
      singleMarkerMode: false
    });

    var onBranchSelect = _.debounce(function () {
      $scope.selectedId = SelectedBranchStore.getSelectedId();
      //angular.element('.marker.active').removeClass('active');
      if ($scope.selectedId) {
        cluster.setActiveId($scope.selectedId);
        var sl = _.find(cluster._layers, {branch_id: $scope.selectedId});
        if (sl) {
          var el = angular.element(sl._icon);
          //el.addClass('active');
          var pos = el.offset();
          var winEl = angular.element($window);
          var frameEl = angular.element('.frame:last');
          var frameLeft = frameEl.offset().left + frameEl.width();
          if ((pos.left - frameLeft) <= 20 || (winEl.width() - frameLeft) <= 20 || pos.top < 20 || pos.top > winEl.height() - 20) {
            leafletData.getMap().then(function (map) {
              var zoom = map.getZoom();
              var p = map.project(sl._latlng, zoom);
              p.x -= 150;
              //$timeout(function () {
              map.panTo(map.unproject(p, map.getZoom()));
              if (zoom < 13) {
                map.setZoom(13);
              }
              //});
            });
          }
        }
      }
      $scope.$digest();
    }, 100);

    $scope.$listenTo(SelectedBranchStore, onBranchSelect);

    cluster.on('click', function(e) {
      var m = e.layer;
      if (m && m.branch_id) {
        $state.go('main.search.firm', {firm_id: m.branch_id});
      }
    });

    $scope.$listenTo(MarkerStore, function () {
      var m, marker;
      var res_markers = MarkerStore.getMarkers();
      var tmp = [];
      for (var i = 0; i < res_markers.length; i++) {
        m = res_markers[i];
        marker = L.marker(L.latLng(m.lat, m.lng), {
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
          marker.html_title += '<ul class="attributes"><li>' + attrs.join('</li><li>') + '</li></ul>';
        }
        tmp.push(marker);
      }

      cluster.clearLayers();
      cluster.addLayers(tmp);
      leafletData.getMap().then(function(map) {
        map.addLayer(cluster);
        onBranchSelect();
      });
    });

    $scope.isLoading = false;
    $scope.nextPage = function () {
      if (!$scope.isLoading && !$scope.error) {
        $scope.isLoading = true;
        params.start = params.start + params.limit;
        BranchActions.load(params).then(function (res) {
          $scope.isLoading = false;
          return res;
        }, function (err) {
          $scope.error = err;
          $scope.isLoading = false;
          return err;
        });
      }
    };

    $scope.$on('$destroy', function () {
      cluster.off('click');
      leafletData.getMap().then(function(map) {
        map.removeLayer(cluster);
      });
      BranchActions.clear();
      $scope.$emit('search.query', null);
    });
  })
;
