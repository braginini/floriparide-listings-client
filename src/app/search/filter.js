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

  .controller('FilterCtrl', function ($scope, $state, TopAttributesStore) {
    var getGroups = function () {
      return _.filter(TopAttributesStore.getTopAttributes() || [], g => {
        return g.attributes && g.attributes.length > 0;
      });
    };

    $scope.goParent = function () {
      $state.go('^');
    };

    $scope.attributeGroups = getGroups();
    $scope.$listenTo(TopAttributesStore, function () {
      $scope.attributeGroups = getGroups();
    });

    $scope.$emit('filter.show');
    $scope.$on('$destroy', () => {
      $scope.$emit('filter.hide');
    });
  })
;
