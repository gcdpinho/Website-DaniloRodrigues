var gulp = require('gulp'),
	  rename = require('gulp-rename'),
	  jshint = require('gulp-jshint'),
	  concat = require('gulp-concat'),
	  uglify = require('gulp-uglify'),
	  stylus = require('gulp-stylus'),
	  minifyCSS = require('gulp-minify-css'),
	  sourcemaps = require('gulp-sourcemaps'),
	  nib = require('nib'),
  	cmq = require('gulp-combine-media-queries'),
		assemble = require('fabricator-assemble'),
		del = require('del'),
		spritesmith = require('gulp.spritesmith'),
		modernizr = require('gulp-modernizr'),
		imagemin = require('gulp-imagemin'),
  	browserSync = require('browser-sync'),
  	reload = browserSync.reload,
  	runSequence = require('run-sequence'),
		watch = require('gulp-chokidar')(gulp);

var config = {
	dest:'Deploy',
	src: 'Frontend/',
	materials: 'materials/**/**/**/**/*.{hbs,md,yml}',
	layouts: 'views/layouts/*.hbs',
	layoutsIncludes: 'views/layouts/includes/*.hbs',
	views: 'views/**/*',
	assemble: '**/*.{hbs,md,json,yml}',
	ignoreLayouts: '/views/+(layouts)/**',
	data:'data/**/*.{json,yml}',
	docs:'docs/**/*.md',
	scripts:'Frontend/assets/js/**/*.js',
	componentsScripts:'Frontend/materials/components/**/**/**/*.js',
	styles:'Frontend/assets/styl/**/*.styl',
	componentsStyles:'Frontend/materials/components/**/**/**/*.styl',
	partialsStyles:'Frontend/materials/partials/**/**/*.styl',
	plugins:'Frontend/assets/plugins/**/*.js',
	fonts:'Frontend/assets/fonts/**/*',
	images:'Frontend/assets/img/**/**/*',
	imagesSrc: 'Frontend/assets/img/',
  sprites: 'Frontend/assets/img/sprite-src/**/*.png',
  spriteStylus: 'Frontend/assets/styl/',
  sprites2x: 'Frontend/assets/img/sprite-src/**/*-2x.png',
  guideAssets: 'Frontend/assets/guide/**/*'
};

gulp.task('clean', function () {
	return del([config.dest]);
});

gulp.task('assemble', function (done) {
	assemble({
		layout: 'default',
    layouts: config.src + config.layouts,
    layoutIncludes: config.src + config.layoutsIncludes,
    views: [config.src + config.views, '!' + config.src + config.ignoreLayouts],
    materials: config.src + config.materials,
    data: [config.src + config.data, config.src + 'materials/components/**/**/**/*.{json,yml}'],
    docs: config.src + config.docs,
    keys: {
        materials: 'materials',
        views: 'views',
        docs: 'docs'
    },
    helpers:{
    	compare: function(lvalue, rvalue, options) {

		    if (arguments.length < 3)
		        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

		    var operator = options.hash.operator || "==";

		    var operators = {
		        '%':       function(l,r) { return l % r; },
		        '==':       function(l,r) { return l == r; },
		        '===':      function(l,r) { return l === r; },
		        '!=':       function(l,r) { return l != r; },
		        '<':        function(l,r) { return l < r; },
		        '>':        function(l,r) { return l > r; },
		        '<=':       function(l,r) { return l <= r; },
		        '>=':       function(l,r) { return l >= r; },
		        'typeof':   function(l,r) { return typeof l == r; }
		    }

		    if (!operators[operator])
		        throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);

		    var result = operators[operator](lvalue,rvalue);

		    if( result ) {
		        return options.fn(this);
		    } else {
		        return options.inverse(this);
		    }
    	}
    },
    onError: function(error) { console.log(error); done(); },
    dest: config.dest});

	done();
});

gulp.task('plugins', function() {
  return gulp.src([config.plugins])
  .pipe(sourcemaps.init())
  .pipe(concat('plugins.min.js'))
  .pipe(sourcemaps.write('../sourcemaps'))
  .pipe(gulp.dest(config.dest + '/pages/Content/js'));
});

gulp.task('scripts', function() {
  return gulp.src([config.scripts, config.componentsScripts])
  .pipe(sourcemaps.init())
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
  .pipe(concat('app.min.js'))
  .pipe(sourcemaps.write('../sourcemaps'))
  .pipe(gulp.dest(config.dest + '/pages/Content/js'));
});

gulp.task('styles', function () {
  return gulp.src([config.styles, config.componentsStyles, config.partialsStyles])
  .pipe(sourcemaps.init())
  .pipe(stylus({use: [nib()]}))
  .pipe(concat('style.min.css'))
  .pipe(sourcemaps.write('../sourcemaps'))
  .pipe(gulp.dest(config.dest + '/pages/Content/css'));
});

gulp.task('components-scripts', function() {
  return gulp.src([config.componentsScripts])
  .pipe(sourcemaps.init())
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
  .pipe(concat('components.min.js'))
  .pipe(uglify())
  .pipe(sourcemaps.write('../sourcemaps'))
  .pipe(gulp.dest(config.dest + '/guide/assets/scripts'));
});

gulp.task('components-styles', function () {
  return gulp.src([config.componentsStyles])
  .pipe(sourcemaps.init())
  .pipe(stylus({use: [nib()]}))
  .pipe(concat('components.min.css'))
  .pipe(minifyCSS({keepBreaks:false}))
  .pipe(sourcemaps.write('../sourcemaps'))
  .pipe(gulp.dest(config.dest + '/guide/assets/styles'));
});

gulp.task('plugins-build', function() {
  return gulp.src([config.plugins])
  .pipe(sourcemaps.init())
  .pipe(concat('plugins.min.js'))
   .pipe(uglify())
  .pipe(sourcemaps.write('../sourcemaps'))
  .pipe(gulp.dest(config.dest + '/pages/Content/js'));
});

gulp.task('scripts-build', function() {
  return gulp.src([config.scripts, config.componentsScripts])
  .pipe(sourcemaps.init())
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
  .pipe(concat('app.min.js'))
  .pipe(uglify())
  .pipe(sourcemaps.write('../sourcemaps'))
  .pipe(gulp.dest(config.dest + '/pages/Content/js'));
});

gulp.task('styles-build', function () {
  return gulp.src([config.styles, config.componentsStyles, config.partialsStyles])
  .pipe(sourcemaps.init())
  .pipe(stylus({use: [nib()]}))
  .pipe(concat('style.min.css'))
  .pipe(minifyCSS({keepBreaks:false}))
  .pipe(sourcemaps.write('../sourcemaps'))
  .pipe(gulp.dest(config.dest + '/pages/Content/css'));
});



// server
gulp.task('serve', function () {

	browserSync({
		server: {
			baseDir: config.dest,
			directory: true
		},
		notify: true,
		logPrefix: 'RCA Frontend'
	});

	gulp.task('assemble:watch', ['assemble'], reload);
	watch(config.assemble, 'assemble:watch');

	gulp.task('styles:watch', ['styles','components-styles'], reload);
	watch([config.styles, config.componentsStyles, config.partialsStyles], 'styles:watch');

	gulp.task('scripts:watch', ['scripts','components-scripts'], reload);
	watch([config.scripts, config.componentsScripts], 'scripts:watch');

	gulp.task('plugins:watch', ['plugins'], reload);
	watch(config.plugins, 'plugins:watch');

	gulp.task('images:watch', ['imgs'], reload);
	watch(config.images, 'images:watch');

	gulp.task('sprites:watch', ['sprite'], reload);
	watch(config.sprites, 'sprites:watch');

	gulp.task('fonts:watch', ['fonts'], reload);
	watch(config.fonts, 'fonts:watch');

	gulp.task('styles-pages:watch', ['styles-pages'], reload);
	watch([config.src + 'assets/styl-pages/*.styl'], 'styles-pages:watch');

});

gulp.task('modernizr', function() {
  gulp.src(config.scripts)
    .pipe(modernizr())
    .pipe(gulp.dest(config.dest + '/pages/Content/js'));
});

gulp.task('fonts', function() {
 return gulp.src(config.fonts)
  .pipe(gulp.dest(config.dest + '/pages/Content/fonts'));
});

gulp.task('imgs', function() {
  return gulp.src([config.images, '!' + config.sprites])
  .pipe(gulp.dest(config.dest + '/pages/Content/img'));
});

gulp.task('imgs-build', function() {
  return gulp.src([config.images, '!' + config.sprites])
  .pipe(imagemin({ optimizationLevel: 7, progressive: true, interlaced: true }))
  .pipe(gulp.dest(config.dest + '/pages/Content/img'));
});

gulp.task('sprite', function () {
  return gulp.src(config.sprites)
  .pipe(spritesmith({
    imgName: '../img/sprite.png',
    imgPath: '../img/sprite.png',
    cssName: 'sprite.styl',
    cssFormat: 'css'/*,
    retinaSrcFilter: config.sprites2x,
    retinaImgName: '../img/sprite-2x.png'*/
  }))
  .pipe(gulp.dest(config.spriteStylus));
});


gulp.task('copy-guide-assets', function() {
 return gulp.src(config.guideAssets)
  .pipe(gulp.dest(config.dest + '/guide/assets/'));
});

// default build task
gulp.task('default', ['clean'], function () {

	// define build tasks
	var tasks = [
		'modernizr',
		'assemble',
		'styles',
		'scripts',
		'plugins',
		'imgs',
		'fonts',
		'sprite',
		'copy-guide-assets',
		'components-styles',
		'components-scripts',
	];

	// run build
	runSequence(tasks, function () {
			gulp.start('serve');
	});

});

gulp.task('build', function(){
// define build tasks
	var tasks = [
		'modernizr',
		'assemble',
		'styles-build',
		'scripts-build',
		'plugins-build',
		'imgs-build',
		'fonts',
		'sprite'
	];

	// run build
	runSequence(tasks, function () {
			console.info('Projeto compilado com sucesso.');
	});
});
