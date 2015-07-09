System.registerModule("src/app/search/filter.js", [], function() {
  "use strict";
  var __moduleName = "src/app/search/filter.js";
  var $__default = angular.module('app.search.filter', ['ui.router', 'services.branches']).config(['$stateProvider', '$urlRouterProvider', function($stateProvider) {
    $stateProvider.state('main.search.filter', {
      url: '/filter',
      views: {child_frame: {
          controller: 'FilterCtrl',
          templateUrl: 'search/filter.tpl.html'
        }}
    });
    $stateProvider.state('main.rubric.filter', {
      url: '/filter',
      views: {child_frame: {
          controller: 'FilterCtrl',
          templateUrl: 'search/filter.tpl.html'
        }}
    });
  }]).controller('FilterCtrl', ["$scope", "$state", "TopAttributesStore", function($scope, $state, TopAttributesStore) {
    var getGroups = function() {
      return _.filter((TopAttributesStore.getTopAttributes() || []).slice(1), (function(g) {
        return g.attributes && g.attributes.length > 0;
      }));
    };
    $scope.goParent = function() {
      $state.go('^');
    };
    $scope.attributeGroups = getGroups();
    $scope.$listenTo(TopAttributesStore, function() {
      $scope.attributeGroups = getGroups();
    });
    $scope.$emit('filter.show');
    $scope.$on('$destroy', (function() {
      $scope.$emit('filter.hide');
    }));
  }]);
  ;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=src/app/search/filter.js
