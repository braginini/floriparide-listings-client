import * as schedule from './schedule.js';

var today = schedule.days[(new Date()).getDay()];

var formatAttribute = function(a) {
  var res = a.name;
  if (a.value === false) {
    return null;
  }
  var descr = [];
  if (a.timerange) {

    let d = a.timerange[today];
    if (!d) {
      return null;
    }
    descr.push(d.from + '-' + d.to);
  }
  if (a.value) {
    switch (a.input_type) {
      case 'number':
        let prefix = ' ';
        let suffix = '';
        if (a.suffix) {
          if (a.suffix.substr(0, 1) === '^') {
            prefix = a.suffix.substring(0);
          } else {
            suffix = a.suffix;
          }
        }
        res +=  ' ' + prefix + a.value + ' ' + suffix;
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
};

export const DisplayGroupIds = {
  'infra':1,
  'payment': 1,
  'cusine': 1
};

export default angular
  .module('directives.branch', [
    'directives.rating',
    'directives.contact',
    'directives.branchSchedule',
    'directives.gallery'
  ])
  .directive('branch', [function () {
    return {
      restrict: 'EA',
      controller: 'BranchCtrl',
      templateUrl: 'directives/branch/branch.tpl.html',
      replace: true,
      scope: {
        b: '=branch'
      }
    };
  }])
  .controller('BranchCtrl', ['$scope', function($scope) {

  }])
  .directive('branchCard', ['$timeout', function ($timeout) {
    return {
      restrict: 'EA',
      controller: 'BranchCardCtrl',
      templateUrl: 'directives/branch/branch-card.tpl.html',
      replace: true,
      scope: {
        branchCard: '='
      },
      link: function ($scope, element) {
        $scope.collapseDescr = true;

        var initDescrState = () => {
          var el = element.find('.description-text');
          if (el && el.length) {
            $scope.collapseDescr = (el[0].scrollHeight - el.height()) > 5;
            if ($scope.collapseDescr) {
              element.find('.card-description > button').show();
            }
          }
        };
        initDescrState();
        $timeout(initDescrState, 0);
      }
    };
  }])
  .controller('BranchCardCtrl', function($scope, Gallery) {
    $scope.b = $scope.branchCard;
    if ($scope.b.photos && $scope.b.photos.length) {
      $scope.b.photos = _.map($scope.b.photos, p => {
        p.width = p.w;
        p.height = p.h;
        return p;
      });
    }
    var attrGroups = $scope.b.attribute_groups || [];
    $scope.attrGroups = _(attrGroups).groupBy(g => {
      if (DisplayGroupIds[g.icon]) {
        return g.icon;
      } else {
        return 'tags';
      }
    }).mapValues(items => {
      return _(items).pluck('attributes').flatten().map(item => {
        item.formatted = formatAttribute(item);
        return item;
      }).filter('formatted').value();
    }).value();

    $scope.showGallery = function (index) {
      Gallery.create($scope.b.photos, index);
    };
  })

  .filter('formatAttribute', function () {
    return formatAttribute;
  })
;
