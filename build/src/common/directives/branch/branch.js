System.registerModule("src/common/directives/branch/branch.js", [], function() {
  "use strict";
  var __moduleName = "src/common/directives/branch/branch.js";
  var schedule = System.get("src/common/directives/branch/schedule.js");
  var today = schedule.days[(new Date()).getDay()];
  var formatAttribute = _.curry(function(locale, a) {
    var res = a.name;
    if (a.value === false) {
      return null;
    }
    var descr = [];
    if (a.timerange) {
      var d = a.timerange[today];
      if (!d) {
        descr.push(locale.getString('common.todayUnavailable'));
      } else {
        descr.push(d.from + '-' + d.to);
      }
    }
    if (a.value) {
      switch (a.input_type) {
        case 'number':
          var prefix = ' ';
          var suffix = '';
          if (a.suffix) {
            if (a.suffix.substr(0, 1) === '^') {
              prefix = a.suffix.substring(1);
            } else {
              suffix = a.suffix;
            }
          }
          res += ' ' + prefix + a.value + ' ' + suffix;
          break;
      }
    }
    if (a.description) {
      descr.push(a.description);
    }
    if (descr.length) {
      res += ' (' + descr.join(', ') + ')';
    }
    return res;
  });
  var DisplayGroupIds = {
    'infra': 1,
    'payment': 1,
    'cusine': 1,
    'delivery': 1
  };
  var $__default = angular.module('directives.branch', ['directives.rating', 'directives.contact', 'directives.branchSchedule', 'directives.gallery']).directive('branch', [function() {
    return {
      restrict: 'EA',
      controller: 'BranchCtrl',
      templateUrl: 'directives/branch/branch.tpl.html',
      replace: true,
      scope: {b: '=branch'}
    };
  }]).controller('BranchCtrl', ['$scope', function($scope) {}]).directive('branchCard', ['$timeout', function($timeout) {
    return {
      restrict: 'EA',
      controller: 'BranchCardCtrl',
      templateUrl: 'directives/branch/branch-card.tpl.html',
      replace: true,
      scope: {branchCard: '='},
      link: function($scope, element) {
        $scope.collapseDescr = true;
        var initDescrState = (function() {
          var el = element.find('.description-text');
          if (el && el.length) {
            $scope.collapseDescr = (el[0].scrollHeight - el.height()) > 5;
            if ($scope.collapseDescr) {
              element.find('.card-description > button').show();
            }
          }
        });
        initDescrState();
        $timeout(initDescrState, 0);
      }
    };
  }]).controller('BranchCardCtrl', ["$scope", "Gallery", "locale", "leafletData", function($scope, Gallery, locale, leafletData) {
    $scope.b = $scope.branchCard;
    if ($scope.b.photos && $scope.b.photos.length) {
      $scope.b.photos = _.map($scope.b.photos, (function(p) {
        p.width = p.w;
        p.height = p.h;
        return p;
      }));
    }
    var attrGroups = $scope.b.attribute_groups || [];
    $scope.attrGroups = _(attrGroups).groupBy((function(g) {
      if (DisplayGroupIds[g.icon]) {
        return g.icon;
      } else {
        return 'tags';
      }
    })).mapValues((function(items) {
      return _(items).pluck('attributes').flatten().map((function(item) {
        item.formatted = formatAttribute(locale)(item);
        return item;
      })).filter('formatted').value();
    })).value();
    $scope.showGallery = function(index) {
      Gallery.create($scope.b.photos, index);
    };
    $scope.locateToAddress = function() {
      leafletData.getMap().then((function(map) {
        var b = $scope.b;
        var zoom = map.getZoom(),
            p = map.project(L.latLng(b.geometry.point.lat, b.geometry.point.lng), zoom);
        p.x -= 150;
        map.panTo(map.unproject(p, zoom));
        if (zoom < 13) {
          map.setZoom(13);
        }
      }));
    };
  }]).filter('formatAttribute', ["locale", function(locale) {
    return formatAttribute(locale);
  }]);
  ;
  return {
    get DisplayGroupIds() {
      return DisplayGroupIds;
    },
    get default() {
      return $__default;
    }
  };
});
//# sourceURL=src/common/directives/branch/branch.js
