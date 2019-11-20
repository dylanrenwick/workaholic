const gulp = require('gulp');
const ts = require('gulp-typescript');
const sm = require('gulp-sourcemaps');
const rimraf = require('rimraf');

function build() {
    var tsProject = ts.createProject('tsconfig.json');

    var tsResult = tsProject.src()
        .pipe(sm.init())
            .pipe(tsProject()).js
            .pipe(sm.write('.'))
            .pipe(gulp.dest('bin/'));

    return tsResult;
};

function clean(done) {
    rimraf.sync('./bin');
    done();
}

exports.build = build;
exports.clean = clean;
exports.default = gulp.series(exports.clean, exports.build);