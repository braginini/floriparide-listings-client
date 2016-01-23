import {smallIcon, markerIcon, paidIcon} from '../../common/extra/BranchClusterGroup.js';

export class SearchCtrl {
  constructor ($scope, $injector, BranchActions, BranchStore, MarkerStore, SelectedBranchStore, BranchLoadingStore,
               TopAttributesStore) {

    var $timeout = $injector.get('$timeout');
    this.query = $injector.get('$stateParams').query;
    if (!this.query) {
      $injector.get('$location').path('/');
      this.isLoading = true;
      return;
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
    this.attributeGroups = [];//TopAttributesStore.getTopAttributes();
    this.selectedId = SelectedBranchStore.selectedId;
    this.isLoading = BranchLoadingStore.isLoading;
    // have to add additional field because of nextPage method
    this.isFirstTimeSpinnerShow = true;

    this.cluster = new L.BranchClusterGroup({
      singleMarkerMode: false
    });

    this.cluster.on('click', e => {
      var m = e.layer;
      if (m && m.branch_id) {
        this.openBranch(m.branch_id);
      }
    });

    this.onBranchSelectDefer = _.debounce(this.onBranchSelect.bind(this), 100, this);

    $scope.$listenTo(BranchStore, 'branches', () => {
      this.branches = BranchStore.branches;
      this.count = BranchStore.count;
      this.eof = BranchStore.isEof;
      this.params = _.assign({
        q: this.query,
        start: -20,
        limit: 20
      }, BranchStore.params);
      //$scope.$broadcast('layoutUpdated');
      $timeout(()=>$scope.$broadcast('layoutUpdated'), 100);
    });

    $scope.$listenTo(TopAttributesStore, () => {
      this.attributeGroups = TopAttributesStore.topAttributes;
    });

    $scope.$listenTo(BranchLoadingStore, () => {
      this.isFirstTimeSpinnerShow = false;
      this.isLoading = BranchLoadingStore.isLoading;
      this.error = BranchLoadingStore.lastError;
    });

    $scope.$listenTo(SelectedBranchStore, this.onBranchSelectDefer);
    $scope.$listenTo(MarkerStore, this.onMarkers.bind(this));

    $scope.$emit('search.query', this.query);

    $scope.$on('filter.show', () => {
      this.showFilter = true;
    });

    $scope.$on('filter.hide', () => {
      this.showFilter = false;
    });

    $scope.$on('$destroy', () => {
      this.cluster.off('click');
      this.map.then(map => {
        map.removeLayer(this.cluster);
      });
      BranchActions.clear();
      $scope.$emit('search.query', null);
    });
  }

  $get(name) {
    return this.$injector.get(name);
  }

  get map() {
    if (!this._leafletData) {
      this._leafletData = this.$get('leafletData');
    }
    return this._leafletData.getMap();
  }

  get winEl() {
    if (!this._winEl) {
      this._winEl = angular.element(this.$get('$window'));
    }
    return this._winEl;
  }

  openBranch(id) {
    this.selectedId = id;
    this.$get('$state').go('main.search.firm', {firm_id: id});
  }

  openFilter() {
    this.$get('$state').go('main.search.filter');
  }

  nextPage() {
    if (!this.isLoading && !this.error) {
      this.params.start = this.params.start + this.params.limit;
      this.branchActions.search(this.params);
    }
  }

  onBranchSelect() {
    this.selectedId = this.selectedBranchStore.selectedId;
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
          this.map.then(map => {
            let zoom = map.getZoom();
            if (zoom < 13) {
              //map.setZoom(13);
              zoom = 13;
            }
            let p = map.project(sl._latlng, zoom);
            p.x -= 150;
            map.setView(map.unproject(p, zoom), zoom);

          });
        }
      }
    }
    this.$scope.$digest();
  }

  onMarkers() {
    var m, marker;
    var res_markers = this.markerStore.markers;
    var tmp = [];
    for (var i = 0; i < res_markers.length; i++) {
      m = res_markers[i];
      marker = L.marker(L.latLng(m.lat, m.lng), {
        icon: markerIcon
        //title: m.name
      });
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
    this.map.then(map => map.addLayer(this.cluster));
  }
}

SearchCtrl.$inject = ['$scope', '$injector', 'BranchActions', 'BranchStore', 'MarkerStore', 'SelectedBranchStore', 'BranchLoadingStore',
  'TopAttributesStore', 'RubricStore'];

export class RubricCtrl extends SearchCtrl {
  constructor ($scope, $injector, BranchActions, BranchStore, MarkerStore, SelectedBranchStore, BranchLoadingStore,
               TopAttributesStore,RubricStore) {
    var ps = $injector.get('$stateParams');
    if (!ps.query && ps.id) {
      let r = _.find(RubricStore.rubrics, {id: ps.id});
      ps.query = r ? r.name : ps.id;
    }
    super($scope, $injector, BranchActions, BranchStore, MarkerStore, SelectedBranchStore, BranchLoadingStore,
      TopAttributesStore);
    var rubricId = ps.id;
    if (!rubricId) {
      $injector.get('$location').path('/');
      this.isLoading = true;
      return;
    }
    delete this.params.q;
    this.params.rubric_id = rubricId;
  }

  openBranch(id) {
    this.selectedId = id;
    this.$get('$state').go('main.rubric.firm', {firm_id: id});
  }

  openFilter() {
    this.$get('$state').go('main.rubric.filter');
  }
}

export class RubricsCtrl {
  constructor($scope, RubricStore, RubricActions, $injector) {
    this.$injector = $injector;
    this.items = [];
    this.rubrics = RubricStore.rubrics;
    if (!this.rubrics.length) {
      RubricActions.load();
    } else {
      this.applyRubrics();
    }
    $scope.$listenTo(RubricStore, ()=> {
      this.rubrics = RubricStore.rubrics;
      this.applyRubrics();
    });
  }

  applyRubrics() {
    var pId = this.$injector.get('$stateParams').parent;
    if (pId === undefined || pId === null) {
      pId = null;
    } else {
      pId = parseInt(pId);
    }
    this.items = _.filter(this.rubrics, r => r.parent_id === pId);
    this.items = _.each(this.items, item => {
      item.childs = _(this.rubrics)
        .filter(r => r.parent_id === item.id)
        .take(3)
        .map(r => r.name)
        .value();
    });
  }

  openRubric(id, name, e = null) {
    if (e) {
      e.preventDefault();
    }
    let $state = this.$injector.get('$state');
    if (_.find(this.rubrics, r => r.parent_id === id)) {
      $state.go('main.rubrics', {
        parent: id
      });
    } else {
      $state.go('main.rubric', {
        id: id,
        query: name
      });
    }
  }
}

export default angular
  .module('app.search', [
    'ui.router',
    'services.branches',
    'services.rubrics',
    'directives.frames',
    'directives.branch',
    'directives.branchFilter',
    'app.search.firm',
    'app.search.filter'
  ])

  .config(($stateProvider) => {
    $stateProvider.state('main.search', {
      url: '/search/:query',
      controller: 'SearchCtrl',
      controllerAs: 'self',
      templateUrl: 'search/search.tpl.html'
    });

    $stateProvider.state('main.rubric', {
      url: '/rubric/{id:int}/:query',
      controller: 'RubricCtrl',
      controllerAs: 'self',
      templateUrl: 'search/search.tpl.html'
    });

    $stateProvider.state('main.rubric2', {
      url: '/rubric/{id:int}',
      controller: 'RubricCtrl',
      controllerAs: 'self',
      templateUrl: 'search/search.tpl.html'
    });

    $stateProvider.state('main.rubrics', {
      url: '/rubrics/{parent:int}/:query',
      controller: 'RubricsCtrl',
      controllerAs: 'self',
      templateUrl: 'search/rubrics.tpl.html',
      params: {
        parent: {
          value: null,
          squash: true
        }
      }
    });
  })

  .controller('SearchCtrl', SearchCtrl)
  .controller('RubricCtrl', RubricCtrl)
  .controller('RubricsCtrl', RubricsCtrl)
;
