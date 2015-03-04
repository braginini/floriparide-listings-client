export default angular
  .module('directives.branchFilter', [
    'directives.rangeSlider',
    'services.branches'
  ])
  .directive('attributeGroupFilters', function () {
    return {
      restrict: 'EA',
      templateUrl: 'directives/branch-filter/attribute-group-filters.tpl.html',
      replace: true,
      scope: {
        g: '=attributeGroupFilters'
      },
      link: function ($scope, element, attrs) {

      },
      controller: function ($scope) {
        $scope.groups = _.groupBy($scope.g.attributes, 'filter_type');
      }
    };
  })
  .directive('attributeCheckbox', function (BranchActions) {
    return {
      restrict: 'EAC',
      template: '<button class="btn btn-default" ng-model="state" ng-change="onChange()" btn-checkbox btn-checkbox-true="1" btn-checkbox-false="0">{{::a.name}}</button>',
      replace: true,
      scope: {
        a: '=attributeCheckbox'
      },
      link: function ($scope) {
        $scope.state = 0;
        $scope.onChange = function () {
          var f = {};
          f[$scope.a.id] = Boolean($scope.state);
          BranchActions.filter(f);
        };
      }
    };
  })
  .directive('attributeSlider', function ($parse, BranchActions) {
    return {
      restrict: 'EAC',
      template:
        '<div class="title">{{::a.name}}:</div>' +
        '<div range-slider min="0" max="100" type="double" postfix="&nbspR$" rg-change="onChange($state)"></div>',
      replace: false,
      link: function ($scope, element, attrs) {
        $scope.min = 0;
        $scope.max = 100;

        var a = $parse(attrs.attributeSlider)($scope);

        $scope.onChange = state => {
          var f = {};
          f[a.id] = [state.from, state.to];
          BranchActions.filter(f);
        };
      },
      controller: function () {
      }
    };
  })
;
