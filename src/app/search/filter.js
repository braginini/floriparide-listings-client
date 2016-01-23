export default angular
  .module('app.search.filter', [
    'ui.router',
    'services.branches'
  ])

  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider) {
    $stateProvider.state('main.search.filter', {
      url: '/filter',
      views: {
        child_frame: {
          controller: 'FilterCtrl',
          templateUrl: 'search/filter.tpl.html'
        }
      }
    });

    $stateProvider.state('main.rubric.filter', {
      url: '/filter',
      views: {
        child_frame: {
          controller: 'FilterCtrl',
          templateUrl: 'search/filter.tpl.html'
        }
      }
    });
  }])

  .controller('FilterCtrl', function ($scope, $state, TopAttributesStore, AvailableAttributesStore) {
    var getGroups = function () {
      var singletons = [];
      var groups = _.filter((TopAttributesStore.topAttributes || []).slice(1), g => {
        if (g.attributes && g.attributes.length > 0) {
          if (g.attributes.length > 1) {
            return true;
          }
          singletons.push(g.attributes[0]);
        }
        return false;
      });
      if (groups[0] && singletons.length) {
        groups[0].attributes = groups[0].attributes.concat(singletons);
      }
      return groups;
    };

    $scope.goParent = function () {
      $state.go('^');
    };

    $scope.attributeGroups = getGroups();
    $scope.$listenTo(TopAttributesStore, function () {
      $scope.attributeGroups = getGroups();
    });

    $scope.availableAttributes = AvailableAttributesStore.attributes;
    $scope.$listenTo(AvailableAttributesStore, function () {
      $scope.availableAttributes = AvailableAttributesStore.attributes;
    });

    $scope.$emit('filter.show');
    $scope.$on('$destroy', () => {
      $scope.$emit('filter.hide');
    });
  })
;
