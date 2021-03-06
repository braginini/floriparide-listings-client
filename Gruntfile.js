module.exports = function (grunt) {

  /**
   * Load in our build configuration file.
   */
  var userConfig = require('./build.config.js');

  require('time-grunt')(grunt);

  /**
   * This is the configuration object Grunt uses to give each plugin its
   * instructions.
   */
  var taskConfig = {
    /**
     * We read in our `package.json` file so we can access the package name and
     * version. It's already there, so we don't repeat ourselves here.
     */
    pkg: grunt.file.readJSON('package.json'),

    /**
     * The banner is the comment that is placed at the top of our compiled
     * source files. It is first processed as a Grunt template, where the `<%=`
     * pairs are evaluated based on this very configuration object.
     */
    meta: {
      banner: '/**\n' +
        ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' *\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n' +
        ' */\n'
    },

    /**
     * Creates a changelog on a new version.
     */
    changelog: {
      options: {
        dest: 'CHANGELOG.md',
        template: 'changelog.tpl'
      }
    },

    /**
     * Increments the version number, etc.
     */
    bump: {
      options: {
        files: [
          'package.json',
          'bower.json'
        ],
        commit: false,
        commitMessage: 'chore(release): v%VERSION%',
        commitFiles: [
          'package.json',
          'client/bower.json'
        ],
        createTag: false,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'origin'
      }
    },

    /**
     * The directories to delete when `grunt clean` is executed.
     */
    clean: [
      '<%= build_dir %>',
      '<%= compile_dir %>'
    ],

    /**
     * The `copy` task just copies files from A to B. We use it here to copy
     * our project assets (images, fonts, etc.) and javascripts into
     * `build_dir`, and then to copy the assets to `compile_dir`.
     */
    copy: {
      build_app_assets: {
        files: [
          {
            src: [ '**' ],
            dest: '<%= build_dir %>/assets/',
            cwd: 'src/assets',
            expand: true
          }
        ]
      },
      build_vendor_assets: {
        files: [
          {
            src: [ '<%= vendor_files.assets %>' ],
            dest: '<%= build_dir %>/assets/',
            cwd: '.',
            expand: true,
            flatten: true
          }
        ]
      },
      build_vendor_images: {
        files: [
          {
            src: [ '<%= vendor_files.images %>' ],
            dest: '<%= build_dir %>/assets/images/',
            cwd: '.',
            expand: true,
            flatten: true
          }
        ]
      },
      build_appjs: {
        files: [
          {
            src: [ '<%= app_files.js %>' ],
            dest: '<%= build_dir %>/',
            cwd: '.',
            expand: true
          }
        ]
      },
      build_vendorjs: {
        files: [
          {
            src: [ '<%= vendor_files.js %>' ],
            dest: '<%= build_dir %>/',
            cwd: '.',
            expand: true
          }
        ]
      },
      build_vendorcss: {
        files: [
          {
            src: [ '<%= vendor_files.css %>' ],
            dest: '<%= build_dir %>/',
            cwd: '.',
            expand: true
          }
        ]
      },
      build_languages: {
        files: [
          {
            src: [ 'languages/**/*.lang.json' ],
            dest: '<%= build_dir %>/',
            cwd: './src/',
            expand: true
          }
        ]
      },
      compile_extra: {
        files: [{
          src: [ 'languages/**/*.lang.json' ],
          dest: '<%= compile_dir %>/',
          cwd: './src/',
          expand: true
        }, {
          src: [ 'traceur_runtime.js' ],
          dest: '<%= compile_dir %>/assets/js',
          cwd: '<%= build_dir %>/vendor',
          expand: true
        }]
      },
      compile_assets: {
        files: [
          {
            src: [ '**' ],
            dest: '<%= compile_dir %>/assets',
            cwd: '<%= build_dir %>/assets',
            expand: true
          }
        ]
      }
    },

    /**
     * `grunt concat` concatenates multiple source files into a single file.
     */
    concat: {

      compile_css: {
        src: [
          '<%= vendor_files.css %>',
          '<%= compile_dir %>/assets/css/<%= pkg.name %>-<%= pkg.version %>.css'
        ],
        dest: '<%= compile_dir %>/assets/css/<%= pkg.name %>-<%= pkg.version %>.css',
        stripBanners: {
          block: true,
          line: true
        }
      },
      /**
       * The `compile_js` target is the concatenation of our application source
       * code and all specified vendor source code into a single file.
       */
      compile_js: {
        options: {
          banner: '<%= meta.banner %>'
        },
        stripBanners: {
          block: true,
          line: true
        },
        src: [
          '<%= vendor_files.js %>',
          'module.prefix',
          '<%= build_dir %>/src/**/*.js',
          '<%= build_dir %>/config.js',
          '<%= html2js.app.dest %>',
          '<%= html2js.common.dest %>',
          'module.suffix'
        ],
        dest: '<%= compile_dir %>/assets/js/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },

    modernizr: {
      build: {
        devFile: 'remote',
        outputFile: 'vendor/modernizr/modernizr.js',
        uglify: false,
        parseFiles: false,
        tests: [
          'localstorage',
          'sessionstorage'
        ]
      }
    },

    /**
     * The `compile` target concatenates compiled CSS and vendor CSS
     * together and minify them.
     */
    cssmin: {
      compile: {
        options: {
          banner: '<%= meta.banner %>'
        },
        files: {
          '<%= build_dir %>/assets/css/<%= pkg.name %>-<%= pkg.version %>.css':
            '<%= build_dir %>/assets/css/<%= pkg.name %>-<%= pkg.version %>.css'
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 versions', 'ie 9', 'android 2.3', 'android 4', 'opera 12']
      },
      build: {
        options: {
          map: false
        },
        src: '<%= build_dir %>/assets/css/<%= pkg.name %>-<%= pkg.version %>.css'
      },
      compile: {
        options: {
          map: false
        },
        src: '<%= compile_dir %>/assets/css/<%= pkg.name %>-<%= pkg.version %>.css'
      }
    },

    /**
     * `ng-min` annotates the sources before minifying. That is, it allows us
     * to code without the array syntax.
     */
    ngAnnotate: {
      compile: {
        files: [
          {
            src: [ '<%= app_files.js %>' ],
            cwd: '<%= build_dir %>',
            dest: '<%= build_dir %>',
            expand: true
          }
        ]
      }
    },

    /**
     * Compile ES6 JS into ES3 JS using Traceur Compiler
     */
    traceur: {
      options: {
        experimental: true,
        copyRuntime: 'build/vendor',
        moduleNaming: {
          stripPrefix: 'build'
        }
      },
      build: {
        files: [
          {
            src: [ '<%= app_files.js %>' ],
            dest: '<%= build_dir %>',
            cwd: '.',
            expand: true
          }
        ]
      }
    },

    /**
     * Minify the sources!
     */
    uglify: {
      compile: {
        options: {
          banner: '<%= meta.banner %>',
          mangle: false
        },
        files: {
          '<%= concat.compile_js.dest %>': '<%= concat.compile_js.dest %>'
        }
      }
    },

    /**
     * `grunt-contrib-less` handles our LESS compilation and uglification automatically.
     * Only our `main.less` file is included in compilation; all other files
     * must be imported from this file.
     */
    less: {
      build: {
        files: {
          '<%= build_dir %>/assets/css/<%= pkg.name %>-<%= pkg.version %>.css': '<%= app_files.less %>'
        },
        options: {
          strictMath: true,
          paths: ['less', '<%= vendor_dir %>/bootstrap/less']
        }
      },
      compile: {
        files: {
          '<%= compile_dir %>/assets/css/<%= pkg.name %>-<%= pkg.version %>.css': '<%= compile_dir %>/assets/css/<%= pkg.name %>-<%= pkg.version %>.css'
        },
        options: {
          cleancss: true,
          compress: true
        }
      }
    },

    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      files: [
        '<%= app_files.less %>'
      ]
    },

    /**
     * `jshint` defines the rules of our linter as well as which files we
     * should check. This file, all javascript sources, and all our unit tests
     * are linted based on the policies listed in `options`. But we can also
     * specify exclusionary patterns by prefixing them with an exclamation
     * point (!); this is useful when code comes from a third party but is
     * nonetheless inside `src/`.
     */
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      src: [
        '<%= app_files.js %>'
      ],
      gruntfile: [
        'Gruntfile.js'
      ]
    },

    jscs: {
      options: {
        config: '.jscsrc'
      },
      src: [
        '<%= app_files.js %>'
      ],
      gruntfile: [
        'Gruntfile.js'
      ]
    },

    comments: {
      compile: {
        // Target-specific file lists and/or options go here.
        options: {
          singleline: true,
          multiline: true
        },
        src: [
          '<%= compile_dir %>/assets/js/*.js',
          '<%= compile_dir %>/assets/css/*.css'
        ]
      }
    },

    /**
     * HTML2JS is a Grunt plugin that takes all of your template files and
     * places them into JavaScript files as strings that are added to
     * AngularJS's template cache. This means that the templates too become
     * part of the initial payload as one JavaScript file. Neat!
     */
    html2js: {
      /**
       * These are the templates from `src/app`.
       */
      app: {
        options: {
          base: 'src/app'
        },
        src: [ '<%= app_files.atpl %>' ],
        dest: '<%= build_dir %>/templates-app.js'
      },

      /**
       * These are the templates from `src/common`.
       */
      common: {
        options: {
          base: 'src/common'
        },
        src: [ '<%= app_files.ctpl %>' ],
        dest: '<%= build_dir %>/templates-common.js'
      }
    },

    /**
     * The `index` task compiles the `index.html` file as a Grunt template. CSS
     * and JS files co-exist here but they get split apart later.
     */
    index: {

      /**
       * During development, we don't want to have wait for compilation,
       * concatenation, minification, etc. So to avoid these steps, we simply
       * add all script files directly to the `<head>` of `index.html`. The
       * `src` property contains the list of included files.
       */
      build: {
        dir: '<%= build_dir %>',
        src: [
          '<%= build_dir %>/vendor/traceur_runtime.js',
          '<%= vendor_files.js %>',
          '<%= build_dir %>/src/**/*.js',
          '<%= build_dir %>/config.js',
          '<%= html2js.common.dest %>',
          '<%= html2js.app.dest %>',
          '<%= vendor_files.css %>',
          '<%= build_dir %>/assets/css/<%= pkg.name %>-<%= pkg.version %>.css'
        ]
      },

      /**
       * When it is time to have a completely compiled application, we can
       * alter the above to include only a single JavaScript and a single CSS
       * file. Now we're back!
       */
      compile: {
        dir: '<%= compile_dir %>',
        src: [
          '<%= compile_dir %>/assets/js/traceur_runtime.js',
          '<%= concat.compile_js.dest %>',
          '<%= compile_dir %>/assets/css/<%= pkg.name %>-<%= pkg.version %>.css'
        ]
      }
    },

    /**
     * And for rapid development, we have a watch set up that checks to see if
     * any of the files listed below change, and then to execute the listed
     * tasks when they do. This just saves us from having to type "grunt" into
     * the command-line every time we want to see what we're working on; we can
     * instead just leave "grunt watch" running in a background terminal. Set it
     * and forget it, as Ron Popeil used to tell us.
     *
     * But we don't need the same thing to happen for all the files.
     */
    delta: {
      /**
       * By default, we want the Live Reload to work for all tasks; this is
       * overridden in some tasks (like this file) where browser resources are
       * unaffected. It runs by default on port 35729, which your browser
       * plugin should auto-detect.
       */
      options: {
        livereload: true
      },

      /**
       * When the Gruntfile changes, we just want to lint it. In fact, when
       * your Gruntfile changes, it will automatically be reloaded!
       */
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: [ 'jshint:gruntfile', 'jscs:gruntfile' ],
        options: {
          livereload: false
        }
      },

      /**
       * When our JavaScript source files change, we want to run lint them and
       * run our unit tests.
       */
      jssrc: {
        files: [
          '<%= app_files.js %>'
        ],
        tasks: [ 'jshint:src', 'jscs:src', /*'copy:build_appjs',*/'traceur:build', 'notify:watch' ]
      },

      /**
       * When assets are changed, copy them. Note that this will *not* copy new
       * files, so this is probably not very useful.
       */
      assets: {
        files: [
          'src/assets/**/*'
        ],
        tasks: [ 'copy:build_app_assets', 'copy:build_vendor_assets', 'copy:build_vendor_images', 'notify:watch' ]
      },

      /**
       * When index.html changes, we need to compile it.
       */
      html: {
        files: [ '<%= app_files.html %>' ],
        tasks: [ 'index:build', 'notify:watch' ]
      },

      /**
       * When our templates change, we only rewrite the template cache.
       */
      tpls: {
        files: [
          '<%= app_files.atpl %>',
          '<%= app_files.ctpl %>'
        ],
        tasks: [ 'html2js', 'notify:watch' ]
      },

      /**
       * When the CSS files change, we need to compile and minify them.
       */
      less: {
        files: [ 'src/**/*.less' ],
        tasks: [ 'less:build', 'notify:watch' ]
      },

      autoprefixer: {
        files: [ '<%= build_dir %>/assets/css/<%= pkg.name %>-<%= pkg.version %>.css' ],
        tasks: [ 'autoprefixer:build', 'notify:watch' ]
      }
    },

    fontello: {
      dist: {
        options: {
          config  : 'fontello.json',
          fonts   : 'src/assets/fonts',
          styles  : 'src/less/icons',
          scss    : false,
          force   : true
        }
      }
    },

    notify: {
      watch: {
        options: {
          title: 'Task Complete',
          message: 'Project was updated'
        }
      },

      build: {
        options: {
          title: 'Task Complete',
          message: 'Project was built'
        }
      }
    }
  };

  grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));

  /** These plugins provide necessary tasks. */
  require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

  /**
   * In order to make it safe to just compile or copy *only* what was changed,
   * we need to ensure we are starting from a clean, fresh build. So we rename
   * the `watch` task to `delta` (that's why the configuration var above is
   * `delta`) and then add a new task called `watch` that does a clean build
   * before watching for changes.
   */
  grunt.renameTask('watch', 'delta');
  grunt.registerTask('watch', [ 'build', 'delta']);

  /**
   * The default task is to build and compile.
   */
  grunt.registerTask('default', [ 'compile']);

  // JS distribution task.
  grunt.registerTask('test', ['newer:jshint', 'newer:jscs', 'newer:csslint']);

  // JS distribution task.
  grunt.registerTask('dist-js', ['ngAnnotate', 'concat:compile_js', 'uglify']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['concat:compile_css', 'less:compile', 'cssmin:compile', 'autoprefixer:compile']);

  /**
   * The `build` task gets your app ready to run for development and testing.
   */
  grunt.registerTask('build', [
    'clean', 'html2js', 'test', 'newer:less:build', 'modernizr',
    'newer:copy:build_app_assets', 'newer:copy:build_vendor_assets', 'newer:copy:build_vendor_images',
    'newer:traceur:build', 'newer:copy:build_vendorjs', 'newer:copy:build_vendorcss', 'newer:copy:build_languages',
    'newer:autoprefixer:build', 'index:build', 'notify:build'
  ]);

  /**
   * The `compile` task gets your app ready for deployment by concatenating and
   * minifying your code.
   */
  grunt.registerTask('compile', [
    'build', 'copy:compile_assets', 'dist-js', 'dist-css', 'copy:compile_extra', /*'comments:compile',*/ 'index:compile'
  ]);

  /**
   * A utility function to get all app JavaScript sources.
   */
  function filterForJS(files) {
    return files.filter(function (file) {
      return file.match(/\.js$/);
    });
  }

  /**
   * A utility function to get all app CSS sources.
   */
  function filterForCSS(files) {
    return files.filter(function (file) {
      return file.match(/\.css$/);
    });
  }

  /**
   * The index.html template includes the stylesheet and javascript sources
   * based on dynamic names calculated in this Gruntfile. This task assembles
   * the list into variables for the template to use and then runs the
   * compilation.
   */
  grunt.registerMultiTask('index', 'Process index.html template', function () {
    var dirRE = new RegExp('^(' + grunt.config('build_dir') + '|' + grunt.config('compile_dir') + ')\/', 'g');
    var jsFiles = filterForJS(this.filesSrc).map(function (file) {
      return file.replace(dirRE, '');
    });
    var cssFiles = filterForCSS(this.filesSrc).map(function (file) {
      return file.replace(dirRE, '');
    });

    grunt.file.copy('src/index.html', this.data.dir + '/index.html', {
      process: function (contents, path) {
        return grunt.template.process(contents, {
          data: {
            scripts: jsFiles,
            styles: cssFiles,
            version: grunt.config('pkg.version')
          }
        });
      }
    });
  });
};
