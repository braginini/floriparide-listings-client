var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'holidays'];
var day_indexes = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
  holidays: 7
};
var day_labels = ['2ª', '3ª', '4ª', '5ª', '6ª', '7ª', '1ª', 'Feriados'];

var formatSchedule = _.curry(function (locale, item) {
  if (!item.from || !item.to) {
    return locale.getString('common.close');
  }
  return item.from + '-' + item.to;
});

var parseTodayTime = function (time, checkTomorrow) {
  var parts = time.split(':');
  var date = new Date();
  date.setHours(parts[0], parts[1]);
  if (checkTomorrow && parts[0] <= 6) {
    date.setTime(date.getTime() + 24 * 3600 * 1000);
  }
  return date;
};

export default angular
  .module('directives.branchSchedule', [
    'ui.bootstrap.tooltip',
    'template/tooltip/tooltip-popup.html',
    'template/tooltip/tooltip-html-unsafe-popup.html'
  ])
  .directive('branchSchedule', function ($interval, $timeout, $parse, locale) {
    return {
      restrict: 'EA',
      templateUrl: 'directives/branch/schedule.tpl.html',
      replace: true,
      link: function ($scope, element, attrs) {

      },
      controller: ['$scope', '$attrs', function ($scope, $attrs) {
        $scope.schedule = _.clone($parse($attrs.branchSchedule)($scope));
        var today = days[(new Date()).getDay()];
        if (!$scope.schedule) {
          $scope.schedule = {};
        }
        /** normalize schedule */
        _.each(days, function (day) {
          var key = day.toLowerCase();
          var items = $scope.schedule[key];
          if (!items || !items.length) {
            $scope.schedule[key] = {
              day: day,
              dayIndex: day_indexes[day],
              items: []
            };
          } else {
            items = _.sortBy(items, 'from');
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
        $scope.now = locale.getString('common.close');
        $scope.isWorking = false;

        var now = new Date();
        var beginUpdateNowText = function (waitingTime, eventType) {
          $timeout(function () {
            var taskId = $interval(function () {
              $scope.timeLeft = Math.round((waitingTime - (new Date()).getTime()) / 60000);
              //$scope.$apply($scope.timeLeft);
              if ($scope.timeLeft <= 0) {
                $scope.timeLeft = null;
                if (eventType === 'open') {
                  $scope.isWorking = true;
                  $scope.now = locale.getString('common.open');
                } else {
                  $scope.isWorking = false;
                  $scope.now = locale.getString('common.close');
                }
                $interval.cancel(taskId);
              }
            }, 60000);
          }, 60000 - (now.getSeconds() * 1000 + now.getMilliseconds()));
        };

        _.each($scope.today.items, function (item) {
          var from = parseTodayTime(item.from),
            to = parseTodayTime(item.to, true),
            diff;

          if (now >= from && now <= to) {
            diff = Math.round((to.getTime() - now.getTime()) / 60000);
            $scope.isWorking = true;
            if (diff > 0 && diff < 60) {
              $scope.now = locale.getString('common.closeIn');
              $scope.timeLeft = diff;
              beginUpdateNowText(to.getTime(), 'close');
            } else {
              $scope.now = locale.getString('common.open');
            }
            return false;
          } else {
            diff = Math.round((from.getTime() - now.getTime()) / 60000);
            if (diff > 0 && diff < 60) {
              $scope.now = locale.getString('common.openIn');
              $scope.timeLeft = diff;
              beginUpdateNowText(from.getTime(), 'open');
              return false;
            }
          }
        });

        var schedule = _.chain($scope.schedule)
          .values()
          .sortBy(function (item) {
            return item.dayIndex;
          })
          .value();
        var breaks = [];
        for (var i = 1; i < $scope.today.items.length; i++) {
          breaks.push({
            from: $scope.today.items[i - 1].to,
            to: $scope.today.items[i].from
          });
        }
        $scope.today.label = locale.getString('common.today');
        $scope.today.breaks = breaks;

        var compare = function (item) {
          if (!item.from || !item.to) {
            return '-';
          }
          return item.from + '-' + item.to;
        };

        $scope.schedule = [];
        var sch_item;
        if (_(schedule).groupBy(compare).size() <= 1) {
          sch_item = schedule[0];
          $scope.today = {
            label: locale.getString('common.everyday'),
            from: sch_item.from,
            to: sch_item.to
          };
        } else {
          if (_(schedule).take(5).groupBy(compare).size() <= 1 &&
            _(schedule).takeRight(2).groupBy(compare).size() <= 1) {

            sch_item = schedule[0];
            $scope.schedule.push({
              label: locale.getString('common.workingDays'),
              from: sch_item.from,
              to: sch_item.to
            });

            sch_item = schedule[5];
            $scope.schedule.push({
              label: locale.getString('common.weekend'),
              from: sch_item.from,
              to: sch_item.to
            });
            schedule.splice(0);
          }
          _.each(schedule, function (item) {
            if (item.dayIndex === 7 && !item.items.length) {
              return;
            }
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
  })
  .directive('scheduleTooltipPopup', [function () {
    return {
      restrict: 'EA',
      templateUrl: 'directives/branch/schedule-popup.tpl.html',
      replace: true,
      scope: {content: '@', placement: '@', animation: '&', isOpen: '&'},
      link: function ($scope, element, attrs) {
        $scope.schedule = angular.fromJson(attrs.content);
        $scope.todayIndex = (new Date()).getDay() - 1;
        if ($scope.todayIndex < 0) {
          $scope.todayIndex = 6;
        }
      }
    };
  }])
  .directive('scheduleTooltip', ['$tooltip', function ($tooltip) {
    return $tooltip('scheduleTooltip', 'tooltip', 'click');
  }])
  .filter('formatAddress', function () {
    return function (address) {
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
  .filter('formatSchedule', function (locale) {
    return formatSchedule(locale);
  })
  .filter('formatToday', function (locale) {
    return function (item) {
      var res = item.label + ': ';
      res += formatSchedule(locale)(item);
      if (item.breaks && item.breaks.length) {
        res += ', ' + locale.getString('common.breakFrom') + ' ' + _.map(item.breaks, formatSchedule(locale)).join(', ');
      }
      return res;
    };
  })
;
