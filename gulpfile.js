import gulp from 'gulp';
import browserSync from 'browser-sync';
import autoprefixer from 'gulp-autoprefixer';
import sourceMaps from 'gulp-sourcemaps';
import lineec from 'gulp-line-ending-corrector';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import concat from 'gulp-concat';
import compressJs from 'gulp-uglify';
import minifyImg from 'gulp-imagemin';
import changed from 'gulp-changed';
import plumber from 'gulp-plumber';
import pug from 'gulp-pug';
import rename from 'gulp-rename';
import babel from 'gulp-babel';

browserSync.create();

const sass = gulpSass(dartSass),
  reload = browserSync.reload;

const root = './',
  cssDest = root + 'src/css',
  cssMinDest = root + 'dist/css',
  sassSrc = root + 'src/sass/',
  js = root + 'src/js/';

const pugSrc = root + 'src/pug/',
  pugIncludes = pug + '/includes/';

const jsSrc = [js + 'app.js'],
  jsDest = root + 'dist/js/';
const imgSrc = root + 'src/img/',
  imgDest = root + 'dist/img/';

// compile sass
gulp.task('compileSass', async () => {
  gulp
    .src(sassSrc + 'style.scss')
    .pipe(sourceMaps.init({ loadMaps: true, largeFile: true }))
    .pipe(sass.sync({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(
      autoprefixer({
        cascade: false,
        overrideBrowserslist: ['last 10 versions'],
      })
    )
    .pipe(rename('style.min.css'))
    .pipe(sourceMaps.write('./maps'))
    .pipe(lineec())
    .pipe(gulp.dest(cssMinDest));
});

//clean js
gulp.task('cleanJs', async () => {
  gulp
    .src(jsSrc)
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(sourceMaps.init({ loadMaps: true, largeFile: true }))
    .pipe(concat('app.min.js'))
    .pipe(compressJs())
    .pipe(sourceMaps.write('./maps'))
    .pipe(lineec())
    .pipe(gulp.dest(jsDest));
});

//img
gulp.task('img', async () => {
  gulp
    .src(imgSrc + '*.*')
    .pipe(changed(imgDest))
    .pipe(minifyImg())
    .pipe(gulp.dest(imgDest));
});

//pug
gulp.task('compilePug', async () => {
  gulp
    .src(['./src/pug/**/index.pug', '!./src/pug/includes/**/*'])
    .pipe(plumber())
    .pipe(
      pug({
        pretty: true,
        basedir: pugSrc,
      })
    )
    .pipe(gulp.dest('dist/'));
});

//watch
gulp.task('watch', async () => {
  browserSync.init({
    server: ['./dist/'],
    online: false,
    ghostMode: false,
    open: 'external',
    ui: false,
    // proxy:
  });
  gulp.watch('src/pug/index.pug', gulp.series('compilePug'));
  gulp.watch(sassSrc + '**/*.scss', gulp.series('compileSass'));
  gulp.watch(jsSrc, gulp.series('cleanJs'));
  gulp.watch(imgSrc, gulp.series('img'));
  gulp
    .watch(['dist/*.html', 'dist/css/*.css', 'dist/js/*.js'])
    .on('change', reload);
});

const build = gulp.series(
  'img',
  'compilePug',
  'compileSass',
  'cleanJs',
  'watch'
);
//default
gulp.task('default', build);
