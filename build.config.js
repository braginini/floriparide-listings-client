/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
  /**
   * The `build_dir` folder is where our projects are compiled during
   * development and the `compile_dir` folder is where our app resides once it's
   * completely built.
   */
  build_dir: 'build',
  compile_dir: 'dist',
  vendor_dir: 'vendor',

  /**
   * This is a collection of file patterns that refer to our app code (the
   * stuff in `src/`). These file paths are used in the configuration of
   * build tasks. `js` is all project javascript, less tests. `ctpl` contains
   * our reusable components' (`src/common`) template HTML files, while
   * `atpl` contains the same, but for our app's code. `html` is just our
   * main HTML file, `less` is our main stylesheet, and `unit` contains our
   * app's unit tests.
   */
  app_files: {
    es6: [ 'src/app/**/*.js' ],
    js: [ 'config.js', 'src/**/*.js',  '!src/es6/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js' ],
    jsunit: [ 'src/**/*.spec.js' ],

    coffee: [ 'src/**/*.coffee', '!src/**/*.spec.coffee' ],
    coffeeunit: [ 'src/**/*.spec.coffee' ],

    atpl: [ 'src/app/**/*.tpl.html' ],
    ctpl: [ 'src/common/**/*.tpl.html' ],

    html: [ 'src/index.html' ],
    less: 'src/less/theme.less'
  },

  /**
   * This is a collection of files used during testing only.
   */
  test_files: {
    js: [

    ]
  },

  /**
   * This is the same as `app_files`, except it contains patterns that
   * reference vendor code (`vendor/`) that we need to place into the build
   * process somewhere. While the `app_files` property ensures all
   * standardized files are collected for compilation, it is the user's job
   * to ensure non-standardized (i.e. vendor-related) files are handled
   * appropriately in `vendor_files.js`.
   *
   * The `vendor_files.js` property holds files to be automatically
   * concatenated and minified with our project source files.
   *
   * The `vendor_files.css` property holds any CSS files to be automatically
   * included in our app.
   *
   * The `vendor_files.assets` property holds any assets to be copied along
   * with our app's assets. This structure is flattened, so it is not
   * recommended that you use wildcards.
   */
  vendor_files: {
    js: [
      'vendor/jquery/dist/jquery.js',
      'vendor/modernizr/modernizr.js',
      'vendor/moment/moment.js',
      'vendor/moment/locale/en-gb.js',
      'vendor/moment/locale/pt-br.js',
      'vendor/moment/locale/ru.js',
      'vendor/moment/locale/de.js',
      'vendor/moment/locale/lv.js',
      //'vendor/moment-timezone/builds/moment-timezone-with-data.min.js',
      'vendor/angular/angular.js',
      'vendor/angulartics/dist/angulartics.min.js',
      'vendor/angulartics/dist/angulartics-piwik.min.js',
      'vendor/angulartics-google-analytics/dist/angulartics-google-analytics.min.js',
      'vendor/angular-fullscreen/src/angular-fullscreen.js',
      'vendor/angular-ui-router/release/angular-ui-router.js',
      'vendor/angular-sanitize/angular-sanitize.js',
      'vendor/angular-seo/angular-seo.js',
      'vendor/angular-cookie/angular-cookie.js',
      'vendor/angular-cookies/angular-cookies.js',
      'vendor/angular-bootstrap/ui-bootstrap-tpls.js',
      'vendor/angular-animate/angular-animate.js',
      'vendor/angular-moment/angular-moment.js',
      'vendor/angular-localization/dist/angular-localization.js',
      'vendor/ion.rangeSlider/js/ion.rangeSlider.js',
      'vendor/ngInfiniteScroll/build/ng-infinite-scroll.js',
      'vendor/lodash/lodash.js',
      'vendor/AngularJS-Toaster/toaster.js',
      'vendor/leaflet-dist/leaflet-src.js',
      'vendor/angular-leaflet-directive/dist/angular-leaflet-directive.js',
      'vendor/leaflet.markercluster/dist/leaflet.markercluster-src.js',
      'vendor/bootstrap-star-rating/js/star-rating.js',
      'vendor/bootstrap/js/tooltip.js',
      'vendor/flux-angular/release/flux-angular.js',
      'vendor/perfect-scrollbar/js/perfect-scrollbar.js'
    ],
    css: [
      'vendor/leaflet-dist/leaflet.css',
      //'vendor/leaflet.markercluster/dist/MarkerCluster.css',
      //'vendor/leaflet.markercluster/dist/MarkerCluster.Defaults.css',
      'vendor/bootstrap-star-rating/css/star-rating.css',
      'vendor/ion.rangeSlider/css/ion.rangeSlider.css',
      'vendor/perfect-scrollbar/css/perfect-scrollbar.css'
    ],
    assets: [

    ],
    images: [
      'vendor/Leaflet.awesome-markers/dist/images/*.png'
    ]
  }
};
