const { src, dest, watch, series } = require('gulp');
const autoprefixer = require('autoprefixer');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();
const cachebust = require('gulp-cache-bust');

// Task to process Sass files
function scssProcessingTask() {
	return src('src/sass/main.scss', { sourcemaps: true })
		.pipe(sass())
		.pipe(postcss([autoprefixer(), cssnano()]))
		.pipe(dest('dist/styles', { sourcemaps: '.' }));
}

// Task to handle JavaScript files
function jsProcessingTask() {
	return src('src/js/scripts.js', { sourcemaps: true })
		.pipe(terser())
		.pipe(dest('dist/scripts', { sourcemaps: '.' }));
}

// Cache-busting Task
function cacheBustingTask() {
	return src('./dist/**/*.html')
		.pipe(
			cachebust({
				type: 'timestamp',
			})
		)
		.pipe(dest('./dist'));
}

// Browsersync Tasks
function browsersyncServe(cb) {
	browsersync.init({
		server: {
			baseDir: 'dist',
		},
	});
	cb();
}

function browsersyncReload(cb) {
	browsersync.reload();
	cb();
}

// Watch Task
function watchTask() {
	watch('dist/**/*.html', browsersyncReload);
	watch(
		['src/sass/**/*.scss', 'src/js/**/*.js'],
		series(
			scssProcessingTask,
			jsProcessingTask,
			cacheBustingTask,
			browsersyncReload
		)
	);
}

// Default Gulp Task
exports.default = series(
	scssProcessingTask,
	jsProcessingTask,
	cacheBustingTask,
	browsersyncServe,
	watchTask
);
