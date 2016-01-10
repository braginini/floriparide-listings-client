export const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'holidays'];

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
//var day_labels = ['Seg.', 'Ter.', 'Qua.', 'Qui.', 'Sex.', 'Sab.', 'Dom.', 'Feriados'];

var formatSchedule = _.curry(function (locale, item) {
  if (!item.from || !item.to) {
    return locale.getString('common.close');
  }
  return item.from + '-' + item.to;
});

var parseTodayTime = function (time, checkTomorrow) {
  var parts = time.split(':');
  var date = new Date();
  date.setHours(parts[0], parts[1], 0, 0);
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
      controller: function ($scope, $attrs, $element) {
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
            items = _.sortByAll(items, item => parseTodayTime(item.from, false), item => parseTodayTime(item.to, true));
            let mergeIdxs = {};
            let prevFrom = parseTodayTime(items[0].from, false).getTime();
            let prevTo = parseTodayTime(items[0].to, true).getTime();
            _.forEach(items, (item, idx) => {
              if (idx > 0) {
                let from = parseTodayTime(item.from, false).getTime();
                let to = parseTodayTime(item.to, true).getTime();
                if (from === prevFrom && to >= prevTo) {
                  mergeIdxs[idx - 1] = idx - 1;
                  prevFrom = from;
                  prevTo = to;
                } else if ((prevFrom <= from && from <= prevTo) && (prevFrom <= to && to <= prevTo)) {
                  mergeIdxs[idx] = idx;
                } else {
                  prevFrom = from;
                  prevTo = to;
                }
              }
            });

            items = _.filter(items, (item, idx) => !(idx in mergeIdxs));

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
        for (let i = 1; i < $scope.today.items.length; i++) {
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
            to: sch_item.to,
            breaks: breaks,
            items: sch_item.items
          };
        } else {
          if (breaks.length === 0 &&
            _(schedule).take(5).groupBy(compare).size() <= 1 &&
            _(schedule).take(7).takeRight(2).groupBy(compare).size() <= 1) {

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

          let day_labels = locale.getString('common.weekDays').split(',');
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
      }
    };
  })

  .directive('scheduleTooltipPopup', function ($window) {
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

        var isOpen = false;
        var onBody = (e) => {
          var isLinkEl = angular.element(e.target).hasClass('today-text');
          if (!angular.element(e.target).parents('div.tooltip').length && isOpen) {
            isOpen = false;
            if (!isLinkEl) {
              angular.element('.schedule-tip').trigger('click');
            }
          } else {
            isOpen = isLinkEl;
          }
        };
        angular.element($window.document.body).on('click', onBody);
        $scope.$on('$destroy', () => {
          isOpen = false;
          angular.element($window.document.body).off('click', onBody);
        });
      }
    };
  })

  .directive('scheduleTooltip', function ($tooltip) {
    return $tooltip('scheduleTooltip', 'tooltip', 'click');
  })

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
        if (address.additional) {
          adr += ' (' + address.additional + ')';
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
        let joiner = item.breaks.length === 1 ? ', ' : ', <br>';
        res += joiner + locale.getString('common.breakFrom') + ' ' + _.map(item.breaks, formatSchedule(locale)).join(', ');
      }
      return res;
    };
  })
;
