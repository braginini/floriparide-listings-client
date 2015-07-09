System.registerModule("src/common/services/cache.js", [], function() {
  "use strict";
  var __moduleName = "src/common/services/cache.js";
  var $__default = angular.module('services.cache', []).factory('adler32', function() {
    return function(str) {
      var adler = 0,
          len = str.length,
          pos = 0;
      var s1 = (adler & 0xffff) | 0,
          s2 = ((adler >>> 16) & 0xffff) | 0,
          n = 0;
      while (len !== 0) {
        n = len > 2000 ? 2000 : len;
        len -= n;
        do {
          s1 = (s1 + str.charCodeAt(pos++)) | 0;
          s2 = (s2 + s1) | 0;
        } while (--n);
        s1 %= 65521;
        s2 %= 65521;
      }
      return (s1 | (s2 << 16)) | 0;
    };
  }).factory('Cache', ['adler32', function(adler32) {
    return function(storage, prefix) {
      var getRealKey = function(key) {
        return prefix + '$$' + key;
      };
      var exists = function(key) {
        return getRealKey(key) in storage;
      };
      var get = function(key, defval) {
        if (defval === undefined) {
          defval = null;
        }
        key = getRealKey(key);
        var value = key in storage ? storage[key] : defval;
        if (storage[value]) {
          value = angular.fromJson(storage[value]);
        }
        return value;
      };
      var put = function(key, value) {
        key = getRealKey(key);
        if (typeof value === 'object') {
          value = angular.toJson(value);
          var hash = prefix + '$$__' + adler32(key);
          storage[key] = hash;
          storage[hash] = value;
        } else {
          storage[key] = value;
        }
      };
      var remove = function(key) {
        key = getRealKey(key);
        if (key in storage) {
          var value = storage[key];
          delete storage[key];
          if (value in storage) {
            delete storage[value];
          }
        }
      };
      var clear = function() {
        _.forOwn(storage, function(val, key) {
          if (prefix === '' || key.indexOf(prefix) === 0) {
            remove(key);
          }
        });
      };
      this.exists = exists;
      this.get = get;
      this.put = put;
      this.remove = remove;
      this.clear = clear;
    };
  }]).factory('cacheFactory', ['Cache', function(Cache) {
    return function(storage, prefix) {
      return new Cache(storage, prefix);
    };
  }]).factory('sessionStorage', ['$window', 'Cache', function($window, Cache) {
    var instance = new Cache($window.sessionStorage, '');
    instance.clear = function() {
      $window.sessionStorage.clear();
    };
    return instance;
  }]).factory('localStorage', ['$window', 'Cache', function($window, Cache) {
    var instance = new Cache($window.localStorage, '');
    instance.clear = function() {
      $window.localStorage.clear();
    };
    return instance;
  }]);
  ;
  return {get default() {
      return $__default;
    }};
});
//# sourceURL=src/common/services/cache.js
