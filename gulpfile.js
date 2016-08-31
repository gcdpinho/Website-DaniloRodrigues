var gulp = require('gulp'),
	  rename = require('gulp-rename'),
	  jshint = require('gulp-jshint'),
	  concat = require('gulp-concat'),
	  uglify = require('gulp-uglify'),
	  stylus = require('gulp-stylus'),
	  cleanCSS = require('gulp-clean-css'),
	  sourcemaps = require('gulp-sourcemaps'),
	  nib = require('nib'),
		assemble = require('fabricator-assemble'),
		del = require('del'),
		spritesmith = require('gulp.spritesmith'),
		modernizr = require('gulp-modernizr'),
		imagemin = require('gulp-imagemin'),
  	browserSync = require('browser-sync'),
  	reload = browserSync.reload,
  	runSequence = require('run-sequence'),
  	stylint = require('gulp-stylint'),
		watch = require('gulp-watch'),
		mainBowerFiles = require('gulp-main-bower-files'),
		order = require("gulp-order");

var config = {
	destDev:'../desenvolvimento/Content/',
	dest: 'Deploy',
	src: 'Frontend/',
	jsons: 'Frontend/json/**/**/*.json',
	bowerfiles: '../bower_components',
	materials: 'materials/**/**/**/**/*.{hbs,md,yml}',
	layouts: 'views/layouts/*.hbs',
	layoutsIncludes: 'views/layouts/includes/*.hbs',
	views: 'views/**/**/**/*.hbs',
	assemble: '**/*.{hbs,md,json,yml}',
	ignoreLayouts: '/views/+(layouts)/**',
	data:'data/**/*.{json,yml}',
	docs:'docs/**/*.md',
	scripts:'Frontend/assets/js/**/*.js',
	componentsScripts:'Frontend/materials/components/**/**/**/*.js',
	styles:'Frontend/assets/styl/**/*.styl',
	componentsStyles:'Frontend/materials/components/**/**/**/*.styl',
	partialsStyles:'Frontend/materials/partials/**/**/*.styl',
  pagesScripts: 'Frontend/views/pages/**/**/*.js',
  pagesStyles: 'Frontend/views/pages/**/**/*.styl',
	plugins:'Frontend/assets/plugins/**/**//*.js',
	fonts:'Frontend/assets/fonts/**/*',
	images:'Frontend/assets/img/**/**/*',
	imagesSrc: 'Frontend/assets/img/',
  sprites: 'Frontend/assets/img/sprite-src/**/*.png',
  spriteStylus: 'Frontend/assets/styl/',
  sprites2x: 'Frontend/assets/img/sprite-src/**/*-2x.png'
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
    data: [config.src + config.data, config.src + 'materials/components/**/**/**/*.{json,yml}', config.src + 'views/pages/**/**/*.{json,yml}'],
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
  .pipe(order(['/bower','/custom']))
  .pipe(concat('plugins.min.js'))
  .pipe(sourcemaps.write('../sourcemaps'))
  .pipe(gulp.dest(config.dest + '/pages/Content/js'))
  .pipe(gulp.dest(config.destDev + '/js'));
});

gulp.task('scripts', function() {
  return gulp.src([config.scripts, config.componentsScripts, config.pagesScripts])
  .pipe(sourcemaps.init())
  .pipe(jshint())
  .pipe(concat('app.min.js'))
  .pipe(sourcemaps.write('../sourcemaps'))
  .pipe(gulp.dest(config.dest + '/pages/Content/js'))
  .pipe(gulp.dest(config.destDev + '/js'));
});

gulp.task('stylus-lint', function () {
  return gulp.src([config.styles,'!Frontend/assets/styl/sprite.styl','!Frontend/assets/styl/2-fonts.styl','!Frontend/assets/styl/0-boilerplate.styl','!Frontend/assets/styl/1-bootstrap.styl', config.componentsStyles, config.partialsStyles, config.pagesStyles])
	.pipe(stylint({
	      rules: {
					"blocks": false,
					"brackets": {
						"expected": "never",
						"error":true
					},
					"colors":  false,
					"colons": {
						"expected": "never",
						"error":true
					},
					"commaSpace": "always",
					"commentSpace": "always",
					"cssLiteral": "never",
					"depthLimit": false,
					"duplicates": {
						"expected": true,
						"error":true
					},
					"efficient": {
						"expected": "always",
						"error":true
					},
					"globalDupe": true,
					"indentPref": false,
					"leadingZero": "never",
					"maxErrors": false,
					"maxWarnings": false,
					"mixed": false,
					"namingConvention": "lowercase-dash",
					"namingConventionStrict": true,
					"none": {
						"expected": "never",
						"error":true
					},
					"noImportant": {
						"expected": true,
						"error":true
					},
					"parenSpace": "always",
					"placeholders": "always",
					"prefixVarsWithDollar": "always",
					"quotePref": "single",
					"semicolons": {
						"expected": "never",
						"error":true
					},
					"sortOrder": false,
					"stackedProperties": "never",
					"trailingWhitespace": false,
					"universal": false,
					"valid": {
						"expected": true,
						"error":true
					},
					"zeroUnits": {
						"expected": "never",
						"error":true
					},
					"zIndexNormalize": false
	      },
        reporter: 'stylint-stylish',
        reporterOptions: {
          verbose: true
        }
    	}
      ))
  .pipe(stylint.reporter());
});

gulp.task('styles',['stylus-lint'], function () {
  return gulp.src([config.styles, config.componentsStyles, config.partialsStyles, config.pagesStyles])
  .pipe(sourcemaps.init())
  .pipe(stylus({use: [nib()]}))
  .pipe(concat('style.min.css'))
  .pipe(sourcemaps.write('../sourcemaps'))
  .pipe(gulp.dest(config.dest + '/pages/Content/css'))
  .pipe(gulp.dest(config.destDev + '/css'))
  .pipe(browserSync.stream({match: "**/*.css"}));
});

gulp.task('plugins-build', function() {
  return gulp.src([config.plugins])
  .pipe(sourcemaps.init())
  .pipe(order(['/bower','/custom']))
  .pipe(concat('plugins.min.js'))
  .pipe(uglify())
  .pipe(sourcemaps.write('../sourcemaps'))
  .pipe(gulp.dest(config.dest + '/pages/Content/js'))
  .pipe(gulp.dest(config.destDev + '/js'));
});

gulp.task('scripts-build', function() {
  return gulp.src([config.scripts, config.componentsScripts, config.pagesScripts])
  .pipe(sourcemaps.init())
  .pipe(jshint())
  .pipe(concat('app.min.js'))
  .pipe(uglify())
  .pipe(sourcemaps.write('../sourcemaps'))
  .pipe(gulp.dest(config.dest + '/pages/Content/js'))
  .pipe(gulp.dest(config.destDev + '/js'));
});

gulp.task('styles-build', function () {
  return gulp.src([config.styles, config.componentsStyles, config.partialsStyles, config.pagesStyles])
  .pipe(sourcemaps.init())
  .pipe(stylus({use: [nib()]}))
  .pipe(concat('style.min.css'))
  .pipe(cleanCSS({keepBreaks:false, compatibility: 'ie8'}))
  .pipe(sourcemaps.write('../sourcemaps'))
  .pipe(gulp.dest(config.dest + '/pages/Content/css'))
  .pipe(gulp.dest(config.destDev + '/css'))
  .pipe(browserSync.stream({match: "**/*.css"}));
});

gulp.task('modernizr', function() {
  gulp.src(config.scripts)
    .pipe(modernizr())
    .pipe(gulp.dest(config.dest + '/pages/Content/js'))
    .pipe(gulp.dest(config.destDev + '/js'));
});

gulp.task('fonts', function() {
 return gulp.src(config.fonts)
  .pipe(gulp.dest(config.dest + '/pages/Content/fonts'))
  .pipe(gulp.dest(config.destDev + '/fonts'));
});

gulp.task('imgs', function() {
  return gulp.src([config.images, '!' + config.sprites])
  .pipe(gulp.dest(config.dest + '/pages/Content/img'))
  .pipe(gulp.dest(config.destDev + '/img'));
});

gulp.task('imgs-build', function() {
  return gulp.src([config.images, '!' + config.sprites])
  .pipe(imagemin({ optimizationLevel: 7, progressive: true, interlaced: true }))
  .pipe(gulp.dest(config.dest + '/pages/Content/img'))
  .pipe(gulp.dest(config.destDev + '/img'));
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

gulp.task('bower-files', function() {
  return gulp.src('./bower.json')
      .pipe(mainBowerFiles())
      .pipe(gulp.dest(config.src + '/assets/plugins/bower'));
});

gulp.task('copy-jsons', function() {
  return gulp.src(config.jsons)
      .pipe(gulp.dest(config.dest + '/pages/Content/json'));
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

	watch(config.assemble, function(){
		runSequence(['assemble'], function () {
			reload();
		});
	});
	watch([config.styles, config.componentsStyles, config.partialsStyles, config.pagesStyles], function(){
		runSequence(['styles']);
	});

	watch([config.scripts, config.componentsScripts, config.pagesScripts], function(){
		runSequence(['scripts'], function () {
			reload();
		});
	});

	watch(config.bowerfiles, function(){
		runSequence(['bower-files']);
	});

	watch(config.plugins, function(){
		runSequence(['plugins'], function () {
			reload();
		});
	});

	watch(config.images, function(){
		runSequence(['imgs'], function () {
			reload();
		});
	});

	watch(config.sprites, function(){
		runSequence(['sprites'], function () {
			reload();
		});
	});
	watch(config.fonts, function(){
		runSequence(['fonts'], function () {
			reload();
		});
	});
	watch(config.jsons, function(){
		runSequence(['copy-jsons'], function () {
			reload();
		});
	});

});

// default build task
gulp.task('default', ['clean'], function () {

	// define build tasks
	var tasks = [
		'modernizr',
		'assemble',
		'scripts',
		'styles',
		'bower-files',
		'plugins',
		'fonts',
		'sprite',
		'imgs',
		'copy-jsons'
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
		'scripts-build',
		'bower-files',
		'plugins-build',
		'styles-build',
		'fonts',
		'sprite',
		'imgs-build',
		'copy-jsons'
	];

	// run build
	runSequence(tasks, function () {
		gulp.start('serve');
	});
});
