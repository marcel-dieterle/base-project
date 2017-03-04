'use strict';

const path = require('path');

const config = {
    packageJson: require('../package.json'),
    base: 'src',
    index: 'src/index.html',
    systemJs: '',
    sources: {
        scripts: 'src/scripts/**/*.js',
        templates: ['src/**/*.html'],
        styles: {
            all: 'src/less/**/*.less',
            main: 'src/less/app.less'
        },
        images: 'src/images/**/*'
    },
    targets: {
        build: {
            root: 'build',
            lib: 'build/lib',
            images: 'build/images',
            css: 'build/css',
            scripts: 'build/scripts'
        }
    },
    browsers: ['IE >= 11', 'last 2 versions'],
    browserSync: {
        ghostMode: false,
        open: true,
        server: {
            baseDir: './build',
            middleware: {}
        },
        port: 8000
    },
    vendorScripts: [

    ],
    bundles: [

    ],
    devScripts: [

    ],
    nodeModules: [
    
    ]
};

config.injectables = [
    ...config.vendorScripts.map(v => path.join(config.targets.build.lib, v.split('/').slice(-1)[0])),
    ...config.bundles.map(v => path.join(config.targets.build.lib, v)),
    ...config.devScripts.map(v => path.join(config.targets.build.lib, v.split('/').slice(-1)[0])),
    path.join(config.targets.build.root, '**/*.css'),
    path.join(config.targets.build.root, '**/*.js')
];

module.exports = config;
