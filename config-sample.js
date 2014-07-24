(function() {
  var config = {
    endpoints: {
      tileLayer: 'http://{s}.tiles.floriparide.com.br/v3/mbraginini.map-hvjt7s3e/{z}/{x}/{y}.png'
    },
    initPoint: {
      lat: -27.592968,
      lng: -48.551674,
      zoom: 11
    },
    maxbounds: [
      [-27.367499, -48.598709],
      [-27.866396, -48.350143]
    ],
    map_defaults: {
      zoomControlPosition: 'topright'
    }
  };

  angular.module('app.config', [])
    .factory('config', function() {
      return config;
    });
})();
