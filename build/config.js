System.registerModule("config.js", [], function() {
  "use strict";
  var __moduleName = "config.js";
  var config = {
    endpoints: {
      api: 'http://api.ficaai.com.br/catalog/1.0',
      tileLayer: 'http://{s}.tiles.floriparide.com.br/v3/mbraginini.map-hvjt7s3e/{z}/{x}/{y}.png'
    },
    initPoint: {
      lat: -27.592968,
      lng: -48.551674,
      zoom: 11
    },
    maxbounds: [[-27.267499, -48.608709], [-27.966396, -48.360143]],
    map_defaults: {
      zoomControlPosition: 'topright',
      zoomAnimation: false,
      markerZoomAnimation: false
    }
  };
  var $__default = config;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=config.js
