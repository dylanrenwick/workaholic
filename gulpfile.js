const gulp = require('gulp');
const ts = require('gulp-typescript');
const sm = require('gulp-sourcemaps');
const rimraf = require('rimraf');
const merge = require('merge2');

function build() {
    var tsProject = ts.createProject('./tsconfig.json');

    var tsResult = tsProject.src()
        .pipe(sm.init())
            .pipe(tsProject());

    return merge([
        tsResult.dts.pipe(gulp.dest('./bin/')),
        tsResult.js.pipe(sm.write('.')).pipe(gulp.dest('./bin/'))
    ]);
};

function clean(done) {
    rimraf.sync('./bin/');
    done();
}

exports.build = build;
exports.clean = clean;
exports.default = gulp.series(exports.clean, exports.build);