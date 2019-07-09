const { src, dest, series, parallel, watch } = require('gulp');
const postcss = require('gulp-postcss');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const atImport = require('postcss-import');
const selector = require('postcss-custom-selectors');
const customProperties = require('postcss-custom-properties');
const sorting = require('postcss-sorting');
const nested = require('postcss-nested');
const reporter = require('postcss-reporter');
const imagemin = require('gulp-imagemin');
const nano = require('gulp-cssnano');
const notify = require('gulp-notify');
const stylelint = require('stylelint');
const browsersync = require('browser-sync');
const terser = require('gulp-terser');
const babel = require('gulp-babel');
const postcssNormalize = require('postcss-normalize');

const paths = {
    js: 'src/js',
    css: 'src/css',
    images: 'src/img/*',
    buildCss: 'css/',
    buildJs: 'js/',
    buildImages: 'img/'
};

const watchpaths = {
    js: [paths.js + '/**/*.js'],
    css: [paths.css + '/**/*.css'],
    minifycss: [paths.buildCss + '/**/*.css'],
    images: [paths.images + '/**/*.*'],
    html: ['/*.html']
};

// BrowserSync
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: './',
            reloadDelay: 200
        },
        open: 'local',
        online: true
    });
    done();
}

// BrowserSync Reload
function browserSyncReload(done) {
    browsersync.reload();
    done();
}

function babelJS() {
    return src(watchpaths.js)
        .pipe(
            babel({
                presets: ['@babel/preset-env']
            })
        )
        .on('error', errorAlertJS)
        .pipe(dest(paths.buildJs))
        .pipe(
            notify({
                message: 'JavaScript complete'
            })
        );
}

function errorAlertJS(error) {
    notify.onError({
        title: 'JavaScript',
        subtitle: 'Something is wrong in your JavaScript file',
        sound: 'Basso'
    })(error);
    console.log(error.toString());
    this.emit('end');
}

function errorAlertPost(error) {
    notify.onError({
        title: 'postCSS',
        subtitle: 'Something is wrong in your CSS file',
        sound: 'Basso'
    })(error);
    console.log(error.toString());
    this.emit('end');
}

function css() {
    const processors = [
        atImport({
            plugins: [stylelint]
        }),
        stylelint,
        reporter({
            clearMessages: true
        }),
        nested,
        customProperties,
        selector,
        sorting({
            'sort-order': 'csscomb'
        }),
        autoprefixer,
        postcssNormalize({
            browsers: 'last 2 versions',
            forceImport: true
        })
    ];
    return src('./src/css/styles.css')
        .pipe(sourcemaps.init())
        .pipe(postcss(processors))
        .on('error', errorAlertPost)
        .pipe(
            sourcemaps.write('./', {
                sourceRoot: '/src'
            })
        )
        .pipe(dest(paths.buildCss))
        .pipe(
            notify({
                message: 'postCSS completed'
            })
        );
}

function minify() {
    return src(watchpaths.minifycss)
        .pipe(nano())
        .pipe(dest(paths.buildCss))
        .pipe(
            notify({
                message: '[CSS] Minify completed'
            })
        );
}

function imageminify() {
    return src(paths.images)
        .pipe(imagemin())
        .pipe(dest(paths.buildImages));
}

function images() {
    return src(paths.images)
        .pipe(imageminify())
        .pipe(dest(paths.buildImages));
}

function compress() {
    return src(watchpaths.js)
        .pipe(terser())
        .on('error', errorAlertJS)
        .pipe(dest(paths.buildJs))
        .pipe(
            notify({
                message: '[JavaScript] Minify completed'
            })
        );
}

function watchFiles() {
    watch(watchpaths.css, { interval: 300 }, series(css, browserSyncReload));
    watch(
        paths.images,
        { interval: 300 },
        series(images, browserSyncReload)
    );
    watch(watchpaths.js, { interval: 300 }, series(babelJS, browserSyncReload));
    watch(
        ['*.html', 'css/*.css', 'js/*.js', './*.csv', './*.json'],
        browserSyncReload
    );
}

const build = series(minify, compress);

const watching = parallel(watchFiles, browserSync);

module.exports = {
    watchFiles,
    browserSync,
    babelJS,
    browserSyncReload,
    css,
    minify,
    imageminify,
    images,
    compress,
    watching,
    build
};
