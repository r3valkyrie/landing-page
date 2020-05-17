"use strict";

// Settings
const opts = {
    clean: true,        // Clean the dist/ directory before compiling.
    pug: true,          // Compile pug files.
    sass: true,         // Compile sass files.
    js: true,           // Compile js files.
    lint: true          // Lint JS.
}

const gulpdist = 'dist/'

const dirs = {
    in: {
        pug: 'src/pug/*.pug',
        sass: 'src/sass/*.sass',
        js: 'src/js/*.js'
    },
    out: {
        pug: gulpdist,
        sass: gulpdist,
        js: gulpdist
    }
}

// Requires
const del = require('del');
const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const jshint = require('gulp-jshint');
const terse = require('gulp-terser');
const browsersync = require('browser-sync');

sass.compiler = require('node-sass')


// Functions
function lintJS(done){
    if (!opts.lint) return done();

    return gulp.src(dirs.in.js)
        .pipe(jshint({
            // JShint opts
        }))
}

function buildJS(done){
    if (!opts.js) return done();

    return gulp.src(dirs.in.js)
        .pipe(concat('bundle.js'))
        .pipe(terse())
        .pipe(gulp.dest(dirs.out.js))
}

function build_sass(done){
    if (!opts.sass) return done();

    return gulp.src(dirs.in.sass)
        .pipe(sass({
            // Sass opts
        }).on('error', sass.logError))
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(dirs.out.sass))
}

function build_pug(done){
    if (!opts.pug) return done();

    return gulp.src(dirs.in.pug)
        .pipe(pug({
            // Pug opts
        }))
        .pipe(gulp.dest(dirs.out.pug))
}

function clean(done){
    if (!opts.clean) return done();

    return del([gulpdist + '*'])
}

function startSrv(done){
    browsersync.init({
        server:{
            baseDir: gulpdist
        }
    });

    done();
}

function bsreload(done){
    browsersync.reload();
    done();
}

function bswatch(done){
    browsersync.watch('src/', gulp.series(exports.default, bsreload));
    done();
}

// Exports
const build = gulp.series(clean, build_sass, lintJS, buildJS, build_pug);
exports.default = build;

const srv = gulp.series(exports.default, startSrv, bswatch)
exports.srv = srv;
