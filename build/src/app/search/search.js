System.registerModule("src/app/search/search.js", [], function() {
  "use strict";
  var __moduleName = "src/app/search/search.js";
  var $__0 = System.get("src/common/extra/BranchClusterGroup.js"),
      smallIcon = $__0.smallIcon,
      markerIcon = $__0.markerIcon,
      paidIcon = $__0.paidIcon;
  var SearchCtrl = (function() {
    function SearchCtrl($scope, $injector, BranchActions, BranchStore, MarkerStore, SelectedBranchStore, BranchLoadingStore, TopAttributesStore) {
      var $__1 = this;
      this.query = $injector.get('$stateParams').query;
      if (!this.query) {
        $injector.get('$location').path('/');
        this.isLoading = true;
        return ;
      }
      this.branchStore = BranchStore;
      this.markerStore = MarkerStore;
      this.selectedBranchStore = SelectedBranchStore;
      this.branchActions = BranchActions;
      this.$scope = $scope;
      this.$injector = $injector;
      this.query = decodeURIComponent(this.query);
      this.params = {
        q: this.query,
        limit: 20,
        start: -20
      };
      this.showFilter = false;
      this._leafletData = null;
      this.eof = false;
      this.count = 0;
      this.branches = [];
      this.attributeGroups = [];
      this.selectedId = SelectedBranchStore.getSelectedId();
      this.isLoading = BranchLoadingStore.isLoading();
      this.isFirstTimeSpinnerShow = true;
      this.cluster = new L.BranchClusterGroup({singleMarkerMode: false});
      this.cluster.on('click', (function(e) {
        var m = e.layer;
        if (m && m.branch_id) {
          $__1.openBranch(m.branch_id);
        }
      }));
      this.onBranchSelectDefer = _.debounce(this.onBranchSelect.bind(this), 100, this);
      $scope.$listenTo(BranchStore, 'branches', (function() {
        $__1.branches = BranchStore.getBranches();
        $__1.count = BranchStore.getCount();
        $__1.eof = BranchStore.isEof();
        $scope.$broadcast('layoutUpdated');
      }));
      $scope.$listenTo(TopAttributesStore, (function() {
        $__1.attributeGroups = TopAttributesStore.getTopAttributes();
      }));
      $scope.$listenTo(BranchLoadingStore, (function() {
        $__1.isFirstTimeSpinnerShow = false;
        $__1.isLoading = BranchLoadingStore.isLoading();
        $__1.error = BranchLoadingStore.getLastError();
      }));
      $scope.$listenTo(SelectedBranchStore, this.onBranchSelectDefer);
      $scope.$listenTo(MarkerStore, this.onMarkers.bind(this));
      $scope.$emit('search.query', this.query);
      $scope.$on('filter.show', (function() {
        $__1.showFilter = true;
      }));
      $scope.$on('filter.hide', (function() {
        $__1.showFilter = false;
      }));
      $scope.$on('$destroy', (function() {
        $__1.cluster.off('click');
        $__1.map.then((function(map) {
          map.removeLayer($__1.cluster);
        }));
        BranchActions.clear();
        $scope.$emit('search.query', null);
      }));
    }
    return ($traceurRuntime.createClass)(SearchCtrl, {
      $get: function(name) {
        return this.$injector.get(name);
      },
      get map() {
        if (!this._leafletData) {
          this._leafletData = this.$get('leafletData');
        }
        return this._leafletData.getMap();
      },
      get winEl() {
        if (!this._winEl) {
          this._winEl = angular.element(this.$get('$window'));
        }
        return this._winEl;
      },
      openBranch: function(id) {
        this.selectedId = id;
        this.$get('$state').go('main.search.firm', {firm_id: id});
      },
      openFilter: function() {
        this.$get('$state').go('main.search.filter');
      },
      nextPage: function() {
        if (!this.isLoading && !this.error) {
          this.params.start = this.params.start + this.params.limit;
          this.branchActions.search(this.params);
        }
      },
      onBranchSelect: function() {
        this.selectedId = this.selectedBranchStore.getSelectedId();
        if (this.selectedId) {
          this.cluster.setActiveId(this.selectedId);
          var sl = _.find(this.cluster._layers, {branch_id: this.selectedId});
          if (sl) {
            var el = angular.element(sl._icon);
            var pos = el.offset();
            var winEl = this.winEl;
            var frameEl = angular.element('.frame:last');
            var frameLeft = frameEl.offset().left + frameEl.width();
            if ((pos.left - frameLeft) <= 20 || (winEl.width() - frameLeft) <= 20 || pos.top < 20 || pos.top > winEl.height() - 20) {
              this.map.then((function(map) {
                var zoom = map.getZoom(),
                    p = map.project(sl._latlng, zoom);
                p.x -= 150;
                map.panTo(map.unproject(p, zoom));
                if (zoom < 13) {
                  map.setZoom(13);
                }
              }));
            }
          }
        }
        this.$scope.$digest();
      },
      onMarkers: function() {
        var $__1 = this;
        var m,
            marker;
        var res_markers = this.markerStore.getMarkers();
        var tmp = [];
        for (var i = 0; i < res_markers.length; i++) {
          m = res_markers[i];
          marker = L.marker(L.latLng(m.lat, m.lng), {icon: markerIcon});
          marker.paid = m.paid;
          marker.branch_id = m.branch_id;
          marker.html_title = '<div>' + m.name + '</div>';
          if (m.attributes && m.attributes.length) {
            var attrs = [];
            for (var j = 0; j < m.attributes.length && j < 3; j++) {
              attrs.push(m.attributes[j].name);
            }
            marker.html_title += '<ul class="attributes"><li>' + attrs.join('</li><li>') + '</li></ul>';
          }
          tmp.push(marker);
        }
        this.cluster.clearLayers();
        this.cluster.addLayers(tmp);
        this.onBranchSelectDefer();
        this.map.then((function(map) {
          return map.addLayer($__1.cluster);
        }));
      }
    }, {});
  }());
  SearchCtrl.$inject = ['$scope', '$injector', 'BranchActions', 'BranchStore', 'MarkerStore', 'SelectedBranchStore', 'BranchLoadingStore', 'TopAttributesStore'];
  var RubricCtrl = (function($__super) {
    function RubricCtrl($scope, $injector, BranchActions, BranchStore, MarkerStore, SelectedBranchStore, BranchLoadingStore, TopAttributesStore) {
      $traceurRuntime.superConstructor(RubricCtrl).call(this, $scope, $injector, BranchActions, BranchStore, MarkerStore, SelectedBranchStore, BranchLoadingStore, TopAttributesStore);
      var rubricId = $injector.get('$stateParams').id;
      if (!rubricId) {
        $injector.get('$location').path('/');
        this.isLoading = true;
        return ;
      }
      delete this.params.q;
      this.params.rubric_id = rubricId;
    }
    return ($traceurRuntime.createClass)(RubricCtrl, {
      openBranch: function(id) {
        this.selectedId = id;
        this.$get('$state').go('main.rubric.firm', {firm_id: id});
      },
      openFilter: function() {
        this.$get('$state').go('main.rubric.filter');
      }
    }, {}, $__super);
  }(SearchCtrl));
  var RubricsCtrl = (function() {
    function RubricsCtrl($scope, RubricStore, RubricActions, $injector) {
      var $__1 = this;
      this.$injector = $injector;
      this.items = [];
      this.rubrics = RubricStore.getRubrics();
      if (!this.rubrics.length) {
        RubricActions.load();
      } else {
        this.applyRubrics();
      }
      $scope.$listenTo(RubricStore, (function() {
        $__1.rubrics = RubricStore.getRubrics();
        $__1.applyRubrics();
      }));
    }
    return ($traceurRuntime.createClass)(RubricsCtrl, {
      applyRubrics: function() {
        var $__1 = this;
        var pId = this.$injector.get('$stateParams').parent;
        if (pId === undefined || pId === null) {
          pId = null;
        } else {
          pId = parseInt(pId);
        }
        this.items = _.filter(this.rubrics, (function(r) {
          return r.parent_id === pId;
        }));
        this.items = _.each(this.items, (function(item) {
          item.childs = _($__1.rubrics).filter((function(r) {
            return r.parent_id === item.id;
          })).take(3).map((function(r) {
            return r.name;
          })).value();
        }));
      },
      openRubric: function(id, name) {
        var e = arguments[2] !== (void 0) ? arguments[2] : null;
        if (e) {
          e.preventDefault();
        }
        var $state = this.$injector.get('$state');
        if (_.find(this.rubrics, (function(r) {
          return r.parent_id === id;
        }))) {
          $state.go('main.rubrics', {parent: id});
        } else {
          $state.go('main.rubric', {
            id: id,
            query: name
          });
        }
      }
    }, {});
  }());
  var $__default = angular.module('app.search', ['ui.router', 'services.branches', 'services.rubrics', 'directives.frames', 'directives.branch', 'directives.branchFilter', 'app.search.firm', 'app.search.filter']).config((["$stateProvider", function($stateProvider) {
    $stateProvider.state('main.search', {
      url: 'search/:query',
      controller: 'SearchCtrl',
      controllerAs: 'self',
      templateUrl: 'search/search.tpl.html'
    });
    $stateProvider.state('main.rubric', {
      url: 'rubric/{id:int}/:query',
      controller: 'RubricCtrl',
      controllerAs: 'self',
      templateUrl: 'search/search.tpl.html'
    });
    $stateProvider.state('main.rubrics', {
      url: 'rubrics/{parent:int}',
      controller: 'RubricsCtrl',
      controllerAs: 'self',
      templateUrl: 'search/rubrics.tpl.html',
      params: {parent: {
          value: null,
          squash: true
        }}
    });
  }])).controller('SearchCtrl', SearchCtrl).controller('RubricCtrl', RubricCtrl).controller('RubricsCtrl', RubricsCtrl);
  ;
  return {
    get SearchCtrl() {
      return SearchCtrl;
    },
    get RubricCtrl() {
      return RubricCtrl;
    },
    get RubricsCtrl() {
      return RubricsCtrl;
    },
    get default() {
      return $__default;
    }
  };
});
//# sourceURL=src/app/search/search.js
