export default angular
  .module('directives.branchFilter', [
    'directives.rangeSlider',
    'services.branches'
  ])
  .directive('attributeGroupFilters', function (BranchActions, BranchStore, leafletData) {
    return {
      restrict: 'EA',
      templateUrl: 'directives/branch-filter/attribute-group-filters.tpl.html',
      replace: true,
      scope: {
        g: '=attributeGroupFilters'
      },
      controller ($scope) {
        $scope.groups = _.groupBy($scope.g.attributes, 'filter_type');

        $scope.filters = {
          visible: false,
          open: false
        };
        $scope.sort = {
          rating: false
        };

        $scope.$listenTo(BranchStore, 'params', function () {
          var params = BranchStore.getParams();
          var filters = params.filters || {};
          $scope.filters = _.mapValues($scope.filters, (value, key) => {
            return filters[key] ? true : false;
          });
        });

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

        $scope.$watch('sort.raiting', function () {
          BranchActions.sort('raiting', Boolean($scope.sort.raiting));
        });
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
