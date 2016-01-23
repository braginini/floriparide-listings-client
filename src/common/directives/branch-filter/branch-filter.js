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
        g: '=attributeGroupFilters',
        showHeader: '@',
        enabledAttributes: '='
      },
      controller ($scope, util) {
        $scope.bShowHeader = util.parseBoolean($scope.showHeader) && $scope.g.attributes.length > 1;
        $scope.groups = _.groupBy($scope.g.attributes, 'filter_type');

        $scope.$watch('g', () => {
          $scope.groups = _.groupBy($scope.g.attributes, 'filter_type');
        });
      }
    };
  })
  .directive('generalAttributeGroupFilters', function (BranchActions, BranchStore, leafletData) {
    return {
      restrict: 'EA',
      templateUrl: 'directives/branch-filter/general-attribute-group-filters.tpl.html',
      replace: true,
      controller ($scope) {
        $scope.filters = {
          visible: false,
          open: false
        };
        $scope.sort = {
          rating: false
        };

        var syncParams = function () {
          var params = BranchStore.params;
          var filters = params.filters || {};
          $scope.filters = _.mapValues($scope.filters, (value, key) => {
            return filters[key] ? true : false;
          });

          var sort = params.sort || {};
          $scope.sort = _.mapValues($scope.sort, (value, key) => {
            return sort[key] ? true : false;
          });
        };
        syncParams();
        $scope.$listenTo(BranchStore, 'params', syncParams);

        leafletData.getMap().then(map => {
          var doFilter = function () {
            BranchActions.filter(_.mapValues($scope.filters, (value, key) => {
              switch (key) {
                case 'visible':
                  if (value) {
                    let bounds = map.getBounds();
                    let nw = bounds.getNorthWest();
                    let se = bounds.getSouthEast();
                    return [nw.lat, nw.lng, se.lat, se.lng];
                  }
                  break;
              }
              return Boolean(value);
            }));
          };
          var filterVisible = _.debounce(() => {
            if ($scope.filters.visible) {
              doFilter();
            }
          }, 500);

          $scope.$watch('filters', doFilter, true);
          map.on('moveend', filterVisible);
          map.on('zoomend', filterVisible);

          $scope.$on('$destroy', function () {
            map.off('moveend', filterVisible);
            map.off('zoomend', filterVisible);
          });
        });

        var prevReting = $scope.sort.rating;
        $scope.$watch('sort.rating', function () {
          if (prevReting !== $scope.sort.rating) {
            prevReting = Boolean($scope.sort.rating);
            BranchActions.sort('rating', Boolean($scope.sort.rating));
          }
        });
      }
    };
  })
  .directive('attributeCheckbox', function (BranchActions) {
    return {
      restrict: 'EAC',
      template: '<button class="btn btn-default" ng-model="state" ng-change="onChange()" uib-btn-checkbox btn-checkbox-true="1" btn-checkbox-false="0">{{::a.name}}</button>',
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
        '<div range-slider min="0" max="{{a.max}}" type="double" prefix="{{a.prefix}}" postfix="{{a.suffix}}" rg-change="onChange($state)"></div>',
      replace: false,
      link: function ($scope, element, attrs) {
        var a = $parse(attrs.attributeSlider)($scope);
        if (!a.max) {
          a.max = 100;
        }
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
