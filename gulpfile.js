/*jslint indent:2, node:true, sloppy:true*/
var
  gulp = require('gulp'),
  del = require('del'),
  lazypipe = require('lazypipe'),
  bowerMain = require('bower-main'),
  ngannotate = require('gulp-ng-annotate'),
  templatecache = require('gulp-angular-templatecache'),
  rename = require("gulp-rename"),
  uglify = require('gulp-uglify'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  minifycss = require('gulp-minify-css'),
  concat = require('gulp-concat'),
  imagemin = require('gulp-imagemin'),
  header = require('gulp-header'),
  cleanhtml = require('gulp-cleanhtml'),
  changed = require('gulp-changed'),
  gulpif = require('gulp-if'),
  jade = require('gulp-jade'),
  connect = require('gulp-connect'),
  plumber = require('gulp-plumber'),
  sourcemaps = require('gulp-sourcemaps'),

  pkg = require('./package.json');

var banner = [
  '/**',
  ' ** <%= pkg.name %> - <%= pkg.description %>',
  ' ** @author <%= pkg.author %>',
  ' ** @version v<%= pkg.version %>',
  ' **/',
  ''
].join('\n');

var build = false;
var dest = 'app';
var bowerScriptFiles = bowerMain('js', 'min.js');
var ngcache = lazypipe()
  .pipe(rename, {dirname: '/'})
  .pipe(templatecache, {standalone: true})
  .pipe(gulp.dest, '.tmp');
/* Scripts */
gulp.task('scripts', function () {
  return gulp.src('src/**/*.js')
    .pipe(plumber())
    .pipe(gulpif(!build, changed('.tmp')))
    .pipe(gulpif(!build, sourcemaps.init()))
    .pipe(concat('scripts.min.js'))
    //.pipe(ngannotate())
   // .pipe(uglify())
    .pipe(gulpif(!build, sourcemaps.write()))
    .pipe(gulpif(build, header(banner, {pkg: pkg})))
    .pipe(gulp.dest('.tmp'));
});
/* Styles */
gulp.task('styles', function () {
  return gulp.src('src/styles/themes/*.scss')
    .pipe(plumber())
    .pipe(gulpif(!build, changed(dest)))
    .pipe(gulpif(!build, sourcemaps.init()))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(minifycss())
    .pipe(gulpif(!build, sourcemaps.write()))
    .pipe(gulpif(build, header(banner, {pkg: pkg})))
    .pipe(rename({dirname: '/themes/'}))
    .pipe(gulp.dest(dest))
    .pipe(connect.reload());
});
/* Dom elements */
gulp.task('dom', function () {
  gulp.src('src/**/*.html')
    .pipe(plumber())
    .pipe(gulpif(!build, changed(dest)))
    .pipe(gulpif(build, rename({dirname: '/'}), rename({dirname: '/upload/tcarlsen/danish-election-2015-results'})))
    .pipe(gulpif(build, cleanhtml()))
    .pipe(gulp.dest(dest));

  return gulp.src(['src/*.jade', 'src/**/*.jade'])
    .pipe(plumber())
    .pipe(gulpif(!build, changed('.tmp')))
    .pipe(jade({pretty: true}))
    .pipe(gulpif(build, cleanhtml()))
    .pipe(gulpif(function (file) {
      if (file.relative !== "index.html") {
        return true;
      }
    }, ngcache(), gulp.dest(dest)));
});
/* Bower scripts */
gulp.task('bower', function () {
  gulp.src(bowerScriptFiles.minifiedNotFound)
    .pipe(plumber())
    .pipe(gulpif(!build, changed('.tmp')))
    .pipe(concat('bower2.js'))
    .pipe(uglify())
    .pipe(gulp.dest('.tmp'));

  return gulp.src(bowerScriptFiles.minified)
    .pipe(plumber())
    .pipe(gulpif(!build, changed('.tmp')))
    .pipe(concat('bower.js'))
    .pipe(gulp.dest('.tmp'));
});
/* Merge scripts */
gulp.task('merge-scripts', ['dom', 'scripts', 'bower'], function () {
  return gulp.src('.tmp/*.js')
    .pipe(plumber())
    .pipe(concat('scripts.min.js'))
    .pipe(gulp.dest(dest))
    .pipe(connect.reload());
});
/* Watch task */
gulp.task('watch', function () {
  gulp.watch(['src/**/*.js', 'src/**/*.jade'], ['merge-scripts']);
  gulp.watch('src/**/*.scss', ['styles']);
  gulp.watch('src/images/**', ['images']);
});
/* Server */
gulp.task('connect', function () {
  connect.server({
    root: 'app',
    port: 9999,
    livereload: true
  });
});
/* Build task */
gulp.task('build', function () {
  build = true;
  dest = 'build';

  del(dest);
  gulp.start('merge-scripts', 'styles');
});
/* Default task */
gulp.task('default', ['connect', 'merge-scripts', 'styles', 'watch']);
