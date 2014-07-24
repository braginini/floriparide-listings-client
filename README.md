floriparide-listings-client
===========================

__Install:__

```sh
$ git clone git@github.com:braginini/floriparide-listings-client.git listings-client
$ cd listings-client
$ sudo npm -g install grunt-cli karma bower
$ npm install
$ bower install
```

In the root folder of the project create file `config.js` based on `config-sample.js`.

__Build:__

```sh
$ grunt
```

Will be created 2 folders:

1. build - dev version of project
2. dist - minified production version  

Next step is configure web http server , for example nginx with root directory as build (for dev) or dist (for production)

Example configuration file for nginx:

```
server {
    listen	80;

    server_name	listings.local;

    access_log	/var/log/nginx/listings-client.access.log;
    error_log	/var/log/nginx/listings-client.error.log;

    root /var/www/listings-client/build;
    index index.html;

    location / {
      try_files $uri $uri/ =404;
    }

    location ~* ^.+.(js|css|png|jpg|jpeg|gif|ico)$ {
      access_log        off;
      expires           max;
    }

    location = /favicon.ico {
      log_not_found off;
      access_log off;
    }

    ## Disable viewing .htaccess & .htpassword
    location ~ /\.ht {
      deny  all;
    }
}
```

In development mode possible to setup automatic project rebuilding on any file changes. Just run monitoring: 

 ```sh
 $ grunt watch
 ```

Additionally possible to setup Live Reload browser plugin, for example [http://livereload.com/](http://livereload.com/),
which will refresh page after success build.

__Project structure:__

```
listings-client/
  |- grunt-tasks/
  |- karma/
  |- src/
  |  |- app/
  |  |  |- <app logic>
  |  |- assets/
  |  |  |- <static files>
  |  |- common/
  |  |  |- <reusable code>
  |  |- less/
  |  |  |- main.less
  |- vendor/
  |  |- angular-bootstrap/
  |  |- bootstrap/
  |- .bowerrc
  |- bower.json
  |- build.config.js
  |- Gruntfile.js
  |- module.prefix
  |- module.suffix
  |- package.json
```

A more detailed description of the structure and working process are given [здесь](https://github.com/ngbp/ngbp).

- `karma/` - tests.
- `src/` - source files
- `vendor/` - libraries installed with [Bower](http://bower.io)
  Every new library should be setup in `build.config.js` and  `karma/karma-unit.js`.
- `.bowerrc` - Bower configuration file.
- `bower.json` - [Bower](http://bower.io) dependencies.
- `build.config.js` - build configuration file.
- `Gruntfile.js` - build script.
- `package.json` - project description.
