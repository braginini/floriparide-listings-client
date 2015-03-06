var urlPattern = /((http|ftp|https):\/\/)*[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/gi;

export default angular
  .module('services.util', [])
  .factory('util', [function () {
    var me = {
      parseUrl: function (url) {
        var a = document.createElement('a');
        a.href = url;
        return {
          source: url,
          protocol: a.protocol.replace(':', ''),
          host: a.hostname,
          port: a.port,
          query: a.search,
          params: (function () {
            var ret = {},
              seg = a.search.replace(/^\?/, '').split('&'),
              len = seg.length, i = 0, s;
            for (; i < len; i++) {
              if (!seg[i]) {
                continue;
              }
              s = seg[i].split('=');
              ret[s[0]] = s[1];
            }
            return ret;
          })(),
          file: (a.pathname.match(/\/([^\/?#]+)$/i) || [''])[1],
          hash: a.hash.replace('#', ''),
          path: a.pathname.replace(/^([^\/])/, '/$1'),
          relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [''])[1],
          segments: a.pathname.replace(/^\//, '').split('/')
        };
      },

      parseBoolean (value) {
        if (value === 0  || value === '0' || value === false || value.toLowerCase() === 'false') {
          return false;
        }
        return true;
      },

      extractUrls: function(text) {
        return text.match(urlPattern);
      },

      urlize: function(value) {
        angular.forEach(value.match(urlPattern), function(url) {
          var split_parts = url.split('.');
          if (split_parts[split_parts.length - 1].match(/^\d+$/)) {
            return;
          }
          var href = url;
          if (url.indexOf('http') !== 0) {
            href = 'http://' + url;
          }
          var link = '<a href=' + href + ' target="_blank">' + url + '</a>';
          var tag_re = new RegExp('href=[\'"]+' + url.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') + '[\'"]+', 'i');
          if (!tag_re.test(value)) {
            value = value.replace(url, link);
          }
        });
        return value;
      }
    };
    return me;
  }])

  .filter('htmlize', ['util', function(util) {
    return function (value) {
      if (value) {
        value = util.urlize(value);
        value = value.replace(/\n/g, '<br />');
      }
      return value;
    };
  }])

  .filter('host', ['util', function(util) {
    return function (url) {
      return util.parseUrl(url).host;
    };
  }])

  .filter('query', function() {
    return function (query, removeSpaces) {
      if (removeSpaces) {
        query = query.replace(/\s/g, '');
      }
      query = query.replace(/\//g, '%2F');
      return encodeURIComponent(query);
    };
  })
;
