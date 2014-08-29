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

    .controller('SearchCtrl', ['$scope', '$injector', '$stateParams', 'BranchesFeed', function ($scope, $injector, $stateParams, BranchesFeed) {
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
    }])
  ;
})();
