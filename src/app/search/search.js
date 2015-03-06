import {smallIcon, markerIcon, paidIcon} from '../../common/extra/BranchClusterGroup.js';

export class SearchCtrl {
  constructor ($scope, $injector, BranchActions, BranchStore, MarkerStore, SelectedBranchStore, BranchLoadingStore,
               TopAttributesStore) {

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

    this._leafletData = null;
    this.eof = false;
    this.count = 0;
    this.branches = [];
    this.attributeGroups = [];
    this.selectedId = SelectedBranchStore.getSelectedId();
    this.isLoading = BranchLoadingStore.isLoading();

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

    $scope.$listenTo(BranchStore, () => {
      this.branches = BranchStore.getBranches();
      this.count = BranchStore.getCount();
      this.eof = BranchStore.isEof();
      $scope.$broadcast('layoutUpdated');
    });

    $scope.$listenTo(TopAttributesStore, () => {
      this.attributeGroups = TopAttributesStore.getTopAttributes();
    });

    $scope.$listenTo(BranchLoadingStore, () => {
      this.isLoading = BranchLoadingStore.isLoading();
      this.error = BranchLoadingStore.getLastError();
    });

    $scope.$listenTo(SelectedBranchStore, this.onBranchSelectDefer);
    $scope.$listenTo(MarkerStore, this.onMarkers.bind(this));

    $scope.$emit('search.query', this.query);

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

  nextPage() {
    if (!this.isLoading && !this.error) {
      this.params.start = this.params.start + this.params.limit;
      this.branchActions.search(this.params);
    }
  }

  onBranchSelect() {
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
          this.map.then(map => {
            let zoom = map.getZoom(),
              p = map.project(sl._latlng, zoom);
            p.x -= 150;
            map.panTo(map.unproject(p, zoom));
            if (zoom < 13) {
              map.setZoom(13);
            }
          });
        }
      }
    }
    this.$scope.$digest();
  }

  onMarkers() {
    var m, marker;
    var res_markers = this.markerStore.getMarkers();
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

export class RubricCtrl extends SearchCtrl {
  constructor ($scope, $injector, BranchActions, BranchStore, MarkerStore, SelectedBranchStore, BranchLoadingStore,
               TopAttributesStore) {
    super($scope, $injector, BranchActions, BranchStore, MarkerStore, SelectedBranchStore, BranchLoadingStore,
      TopAttributesStore);

    var rubricId = $injector.get('$stateParams').id;
    if (!rubricId) {
      $injector.get('$location').path('/');
      this.isLoading = true;
      return;
    }
    delete this.params.q;
    this.params.rubric_id = rubricId;
  }

  nextPage() {
    if (!this.isLoading && !this.error) {
      this.params.start = this.params.start + this.params.limit;
      this.branchActions.list(this.params);
    }
  }

  openBranch(id) {
    this.selectedId = id;
    this.$get('$state').go('main.rubric.firm', {firm_id: id});
  }

}

export default angular
  .module('app.search', [
    'ui.router',
    'services.branches',
    'directives.frames',
    'directives.branch',
    'directives.branchFilter',
    'app.firm'
  ])

  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider) {
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
  }])

  .controller('SearchCtrl', SearchCtrl)
  .controller('RubricCtrl', RubricCtrl)
;
