'use strict';

const gulp = require('gulp'),
    del = require('del'),
    config = require('./config'),
    count = require('gulp-count'),
    less = require('gulp-less'),
    batch = require('gulp-batch'),
    autoprefixer = require('gulp-autoprefixer'),
    watch = require('gulp-watch'),
    runSequence = require('run-sequence'),
    path = require('path'),
    browserSync = require('browser-sync').create(),
    inject = require('gulp-inject');

gulp.task('dev:clean', () => del(config.targets.build.root));

function createLessPipe(sources) {
    return sources
        .pipe(less())
        .pipe(autoprefixer({ browsers: config.browsers }))
        .pipe(count('Preprocessed ## style files'))
        .pipe(gulp.dest(config.targets.build.css))
        .pipe(browserSync.stream({ match: '**/*.css' }));
}

function createScriptPipe(sources) {
    return sources
        .pipe(count('Preprocessed ## script files'))
        .pipe(gulp.dest(config.targets.build.scripts));;
}

gulp.task('dev:styles', () => createLessPipe(gulp.src(config.sources.styles.main)));
gulp.task('dev:scripts', () => gulp.src(config.sources.scripts).pipe(gulp.dest(config.targets.build.scripts)));
gulp.task('dev:images', () => gulp.src(config.sources.images).pipe(gulp.dest(config.targets.build.images)));

gulp.task('dev:scripts:watch', () => watch(config.sources.scripts, 
    batch(events => createScriptPipe(gulp.src(config.sources.scripts)))));

gulp.task('dev:styles:watch', () => watch(config.sources.styles.all, 
    batch(events => createLessPipe(gulp.src(config.sources.styles.main)))));

gulp.task('dev:watch:init', done => { browserSync.init(config.browserSync, done) });

gulp.task('dev:vendorScripts', () =>
    gulp.src([
        ...config.vendorScripts,
        ...config.devScripts,
    ]).pipe(gulp.dest(config.targets.build.lib))
);


gulp.task('dev:nodeModules', () =>
    gulp.src(config.nodeModules.map(m => path.join('node_modules', m, '**/*.{js,map}')), { base: 'node_modules' })
        .pipe(gulp.dest(config.targets.build.lib))
);

gulp.task('dev:index', () => {
    const injectables = gulp.src(config.injectables, { read: false });

    return gulp.src(config.index)
        .pipe(inject(injectables, {
            addRootSlash: false,
            ignorePath: config.targets.build.root
        }))
        .pipe(gulp.dest(config.targets.build.root))
        .on('end', () => browserSync.reload());
});

gulp.task('dev:index:watch', () => watch(config.index, batch((events, done) => runSequence('dev:index', done))));


gulp.task('dev:watch', done => {
    runSequence(
        'dev:watch:init',
        [
            'dev:styles:watch',
            'dev:index:watch',
            'dev:scripts:watch'
        ],
        done
    );
});

gulp.task('dev-build', done => {
    runSequence(
        'dev:clean',
        [
            'dev:images',
            'dev:vendorScripts',
            'dev:nodeModules',
            'dev:scripts',
            'dev:styles'
        ],
        'dev:index',
        done
    );
});

gulp.task('dev-watch', done => {
    runSequence(
        'dev-build',
        'dev:watch',
        done
    );
});
