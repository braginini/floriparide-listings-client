(function () {
  var days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  var day_indexes = {
    monday: 0,
    tuesday: 1,
    wednesday: 2,
    thursday: 3,
    friday: 4,
    saturday: 5,
    sunday: 6
  };
  var day_labels = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

  var formatSchedule = function(item) {
    if (!item.from || !item.to) {
      return 'закрыто';
    }
    return item.from + '-' + item.to;
  };

  var parseTodayTime = function(time) {
    var parts = time.split(':');
    var date = new Date();
    date.setHours(parts[0], parts[1]);
    return date;
  };

  angular
    .module('directives.branch', [
      'directives.rating',
      'directives.contact',
      'ui.bootstrap.tooltip',
      'template/tooltip/tooltip-popup.html',
      'template/tooltip/tooltip-html-unsafe-popup.html'
    ])
    .directive('branch', [function () {
      return {
        restrict: 'EA',
        controller: 'BranchCtrl',
        templateUrl: 'directives/branch/branch.tpl.html',
        replace: true,
        scope: {
          b: '=branch'
        },
        link: function ($scope, element, attrs) {

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
        link: function ($scope, element, attrs) {
          $scope.collapseDescr = true;
          $timeout(function () {
            var el = element.find('.description-text');
            $scope.collapseDescr = el[0].scrollHeight > el.height();
            if ($scope.collapseDescr) {
              element.find('.card-description > button').show();
            }
          }, 200);
        }
      };
    }])
    .controller('BranchCardCtrl', ['$scope', function($scope) {
      $scope.b = $scope.branchCard;
    }])
    .directive('schedule', ['$interval', '$timeout', function ($interval, $timeout) {
      return {
        restrict: 'EA',
        templateUrl: 'directives/branch/schedule.tpl.html',
        replace: true,
        scope: {
          schedule: '='
        },
        controller: ['$scope', function($scope) {
          var today = days[(new Date()).getDay()];
          if (!$scope.schedule) {
            $scope.schedule = {};
          }
          /** normalize schedule */
          _.each(days, function(day) {
            var key = day.toLowerCase();
            var items = $scope.schedule[key];
            if (!items || !items.length) {
              $scope.schedule[key] = {
                day: day,
                dayIndex: day_indexes[day],
                items: []
              };
            } else {
              $scope.schedule[key] = {
                day: day,
                dayIndex: day_indexes[day],
                from: items[0].from,
                to: items[items.length - 1].to,
                items: items
              };
            }
          });
          /*****/
          $scope.today = $scope.schedule[today.toLowerCase()];
          $scope.now = 'Закрыто';
          $scope.isWorking = false;

          var now = new Date();
          var beginUpdateNowText = function (waitingTime, eventType) {
            $timeout(function() {
              var taskId = $interval(function() {
                $scope.timeLeft = Math.round((waitingTime - (new Date()).getTime()) / 60000);
                $scope.$apply($scope.timeLeft);
                if ($scope.timeLeft <= 0) {
                  $scope.timeLeft = null;
                  if (eventType === 'open') {
                    $scope.isWorking = true;
                    $scope.now = 'Открыто';
                  } else {
                    $scope.isWorking = false;
                    $scope.now = 'Закрыто';
                  }
                  $interval.cancel(taskId);
                }
              }, 60000);
            }, 60000 - (now.getSeconds() * 1000 + now.getMilliseconds()));
          };

          _.each($scope.today.items, function(item) {
            var from = parseTodayTime(item.from),
                to = parseTodayTime(item.to),
                diff;

            if (now >= from && now <= to) {
              diff = Math.round((to.getTime() - now.getTime()) / 60000);
              $scope.isWorking = true;
              if (diff < 60) {
                $scope.now = 'Закроется через';
                $scope.timeLeft = diff;
                beginUpdateNowText(to.getTime(), 'close');
              } else {
                $scope.now = 'Открыто';
              }
              return false;
            } else {
              diff = Math.round((from.getTime() - now.getTime()) / 60000);
              if (diff < 60) {
                $scope.now = 'Откроется через';
                $scope.timeLeft = diff;
                beginUpdateNowText(from.getTime(), 'open');
                return false;
              }
            }
          });

          var schedule = _.chain($scope.schedule)
            .values()
            .sortBy(function(item) {
              return item.dayIndex;
            })
            .value()
          ;
          var breaks = [];
          for (var i = 1; i < $scope.today.items.length; i++) {
            breaks.push({
              from: $scope.today.items[i - 1].to,
              to: $scope.today.items[i].from
            });
          }
          $scope.today.label = 'Сегодня';
          $scope.today.breaks = breaks;

          var compare = function(item) {
            if (!item.from || !item.to) {
              return '-';
            }
            return item.from + '-' + item.to;
          };

          $scope.schedule = [];
          var sch_item;
          if (_.every(schedule, compare)) {
            sch_item = schedule[0];
            $scope.today = {
              label: 'Ежедневно',
              from: sch_item.from,
              to: sch_item.to
            };
          } else {
            if (_.chain(schedule).first(5).every(compare) && _.chain(schedule).last(2).every(compare)) {
              sch_item = schedule[0];
              $scope.schedule.push({
                label: 'Будние дни',
                from: sch_item.from,
                to: sch_item.to
              });

              sch_item = schedule[5];
              $scope.schedule.push({
                label: 'Суббота, воскресенье',
                from: sch_item.from,
                to: sch_item.to
              });
              schedule.splice(0);
            }
            _.each(schedule, function(item) {
              $scope.schedule.push({
                label: day_labels[item.dayIndex],
                from: item.from,
                to: item.to,
                items: item.items,
                dayIndex: item.dayIndex
              });
            });
          }
        }]
      };
    }])
    .directive('scheduleTooltipPopup', [function () {
      return {
        restrict: 'EA',
        templateUrl: 'directives/branch/schedule-popup.tpl.html',
        replace: true,
        scope: { content: '@', placement: '@', animation: '&', isOpen: '&' },
        link: function ($scope, element, attrs) {
          $scope.schedule = angular.fromJson(attrs.content);
          $scope.todayIndex = (new Date()).getDay() - 1;
          if ($scope.todayIndex < 0) {
            $scope.todayIndex = 6;
          }
        }
      };
    }])
    .directive( 'scheduleTooltip', [ '$tooltip', function ( $tooltip ) {
      return $tooltip( 'scheduleTooltip', 'tooltip', 'click' );
    }])
    .filter('formatAddress', function() {
      return function(address) {
        var adr = '';
        if (address) {
          if (address.street) {
            adr = address.street;
          }

          if (address.street_number) {
            adr += ' ' + address.street_number;
          }

          if (address.neighborhood) {
            if (adr.length) {
              adr += ',';
            }
            adr += ' ' + address.neighborhood;
          }
        }
        return adr;
      };
    })
    .filter('formatSchedule', function() {
      return formatSchedule;
    })
    .filter('formatToday', function() {
      return function(item) {
        var res = item.label + ': ';
        res += formatSchedule(item);
        if (item.breaks && item.breaks.length) {
          res += ', перерыв с ' + _.map(item.breaks, formatSchedule).join(', ');
        }
        return res;
      };
    })
  ;
})();
