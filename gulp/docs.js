const gulp = require('gulp');

//HTML
const webpHTML = require('gulp-webp-html');
const fileInclude = require('gulp-file-include');
const htmlclean = require('gulp-htmlclean');

//CSS
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const sassGlob = require('gulp-sass-glob');
const csso = require('gulp-csso');
const webpCSS = require('gulp-webp-css');

//GULP
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourceMaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');

//IMAGES
const webp = require('gulp-webp');
const imageMin = require('gulp-imagemin');
const changed = require('gulp-changed');
const groupMedia = require('gulp-group-css-media-queries');

const fileIncludeSetting = {
  prefix: '@@',
  basepath: '@file',
};

const serverOptions = { livereload: true, open: true };

const plumberNotify = (title) => {
  return {
    errorHandler: notify.onError({
      title: 'Styles',
      message: 'Error: <%= error.message %>',
      sound: false,
    }),
  };
};

gulp.task('html:docs', function () {
  return gulp
    .src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
    .pipe(changed('./docs/'))
    .pipe(plumber(plumberNotify('HTML')))
    .pipe(fileInclude(fileIncludeSetting))
    .pipe(webpHTML())
    .pipe(htmlclean())
    .pipe(gulp.dest('./docs/'));
});

const plumberSASSconfig = {
  errorHandler: notify.onError({
    title: 'Styles',
    message: 'Error: <%= error.message %>',
    sound: false,
  }),
};

gulp.task('sass:docs', function () {
  return gulp
    .src('./src/scss/*.scss')
    .pipe(changed('./docs/css'))
    .pipe(plumber(plumberNotify('SCSS')))
    .pipe(sourceMaps.init())
    .pipe(autoprefixer())
    .pipe(sassGlob())
    .pipe(webpCSS())
    .pipe(groupMedia())
    .pipe(sass())
    .pipe(csso())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('./docs/css/'));
});

gulp.task('images:docs', function () {
  return gulp
    .src('./src/img/**/*')
    .pipe(changed('./docs/img'))
    .pipe(webp())
    .pipe(gulp.dest('./docs/img/'))

    .pipe(gulp.src('./src/img/**/*'))
    .pipe(changed('./docs/img'))
    .pipe(imageMin({ verbose: true }))
    .pipe(changed('./docs/img'));
});

gulp.task('fonts:docs', function () {
  return gulp
    .src('./src/fonts/**/*')
    .pipe(changed('./docs/fonts'))
    .pipe(gulp.dest('./docs/fonts/'));
});

gulp.task('files:docs', function () {
  return gulp
    .src('./src/files/**/*')
    .pipe(changed('./docs/files'))
    .pipe(gulp.dest('./docs/files/'));
});

gulp.task('js:docs', function () {
  return gulp
    .src(['./src/js/*.js'])
    .pipe(changed('./docs/js'))
    .pipe(plumber(plumberNotify('JS')))
    .pipe(babel())
    .pipe(webpack(require('./../webpack.config')))
    .pipe(gulp.dest('./docs/js'));
});

gulp.task('server:docs', function () {
  return gulp.src('./docs/').pipe(server(serverOptions));
});

gulp.task('clean:docs', function (done) {
  if (fs.existsSync('./docs/')) {
    return gulp.src('./docs/', { read: false }).pipe(clean({ force: true }));
  }
  done();
});
