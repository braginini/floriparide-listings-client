var smallIcon = L.divIcon({
  iconSize:null,
  className: 'location-small marker'
  //html: '<i class="icon-location"></i>'
});

var markerIcon = L.divIcon({
  iconSize:null,
  className: 'location-medium marker'
  //html: '<i class="icon-circle"></i>'
});

var paidIcon = L.divIcon({
  iconSize:null,
  className: 'location-paid marker',
  html: '<i class="icon-star"></i>'
});

L.BranchClusterGroup = L.FeatureGroup.extend({
  options: {
    maxClusterRadius: 35 //A cluster will cover at most this many pixels from its center
  },

  initialize: function (options) {
    L.Util.setOptions(this, options);
    this._layers = {};
    this._zoom = 0;
    this._maxZoom = 0;
    this._gridClusters = {};
    this._currentShownBounds = null;
  },

  //Takes an array of markers and adds them in bulk
  addLayers: function (layersArray) {
    var i, l, m;

    for (i = 0, l = layersArray.length; i < l; i++) {
      m = layersArray[i];
      this.addLayer(m);
    }

    return this;
  },

  //Overrides FeatureGroup.onAdd
  onAdd: function (map) {
    if (!isFinite(map.getMaxZoom())) {
      throw 'Map has no maxZoom specified';
    }

    this._map = map;

    _.each(this._layers, function (l, i) {
      if (i % 20 === 0) {
        l.paid = true;
      }
    }, this);

    this.updateClusters();
    this._map.on('zoomend', this.updateClusters, this);

    this.eachLayer(map.addLayer, map);

    _.each(this._layers, function (l, i) {
      l.on('mouseover', function () {
        var iconEl = $(l._icon);
        iconEl.tooltip({
          html: true,
          title: l.html_title
        });
        iconEl.tooltip('show');

        //iconEl.addClass('active');
      });

      //l.on('mouseout', function () {
      //  l.removeClass('active');
      //});
    }, this);
  },

  updateClusters: function () {
    var zoom = this._map.getZoom();
    if (this._zoom !== zoom) {
      var grid, layers;
      if (!this._gridClusters[zoom]) {
        grid = new L.DistanceGrid(this.options.maxClusterRadius, this._map.getPixelBounds());
        this._gridClusters[zoom] = grid;
        layers = _.groupBy(this._layers, 'paid');
        _.each(layers[true], function (m) {
          var point = this._map.project(m.getLatLng(), zoom),
              cluster = {
                paid: [m._leaflet_id],
                items: []
              };
          // todo: in one point can be several paid markers
          grid.addObject(cluster, point);
        }, this);
        _.each(layers[false], function (m) {
          var point = this._map.project(m.getLatLng(), zoom),
              cluster = grid.getNearObject(point);
          if (!cluster)  {
            cluster = {
              paid: [],
              items: []
            };
            grid.addObject(cluster, point);
          }
          cluster.items.push(m._leaflet_id);
        }.bind(this));
      } else {
        grid = this._gridClusters[zoom];
      }
      grid.eachObject(function (cluster) {
        var m, i, top = false;
        if (cluster.paid.length) {
          for (i = 0; i < cluster.paid.length; i++) {
            m = this.getLayer(cluster.paid[i]);
            m.setZIndexOffset(200);
            m.setIcon(paidIcon);
            top = true;
          }
        }

        for (i = 0; i < cluster.items.length; i++) {
          m = this.getLayer(cluster.items[i]);
          if (!top) {
            m.setZIndexOffset(100);
            m.setIcon(markerIcon);
            top = true;
          } else {
            m.setZIndexOffset(0);
            m.setIcon(smallIcon);
          }
        }
      }.bind(this));
      this._zoom = zoom;
    }
  }
});
