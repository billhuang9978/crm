/// <binding AfterBuild='clean, min' />
/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require('gulp'),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify");

var paths = {
    root: ""
};

paths.js = paths.root + "scripts/**/*.js";
paths.minJs = paths.root + "scripts/**/*.min.js";
paths.concatJsDest = paths.root + "scripts/CrmCodeEditor.min.js";
paths.css = paths.root + "content/**/*.css";
paths.minCss = paths.root + "content/**/*.min.css";
paths.concatCssDest = paths.root + "content/CrmCodeEditor.min.css";

gulp.task("clean:js", function (cb) {
    rimraf(paths.concatJsDest, cb);
});

gulp.task("clean:css", function (cb) {
    rimraf(paths.concatCssDest, cb);
});

gulp.task("clean", ["clean:js", "clean:css"]);

gulp.task("min:js", function () {
    return gulp.src(["scripts/angular.js", "scripts/angularroute.js", "scripts/angularblockui.js", "scripts/angularnotify.js",
    "scripts/bluebird.js", "scripts/system.js", "scripts/clipboard.js", "scripts/esprima.js", "scripts/uigrid.js",
    "scripts/xml2json.js", "scripts/CrmCodeEditor.js"])
      .pipe(concat(paths.concatJsDest))
      .pipe(uglify())
      .pipe(gulp.dest("."));
});

gulp.task("min:css", function () {
    return gulp.src([paths.css, "!" + paths.minCss])
      .pipe(concat(paths.concatCssDest))
      .pipe(cssmin())
      .pipe(gulp.dest("."));
});

gulp.task("min", ["min:js", "min:css"]);