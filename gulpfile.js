const   { src, dest, watch, series, task } = require('gulp'),
        sass = require('gulp-sass')(require('sass')),
        rename = require('gulp-rename'),
        babel = require('gulp-babel'),
        noop = require('gulp-noop'),
        uglify = require('gulp-uglify'),
        concat = require('gulp-concat'),
        { exec, spawn } = require('child_process'),
        { platform } = require('os'),
        path = require('path'),
        babelConfig = require('./src/babel_config.json'),
        command = `tweego${(platform() == 'win32')?'.exe':''}`, 
        options = {cwd:path.resolve('vendor'), stdio: 'inherit'},   
        args = ['--format=sugarcube-2', '--output=../dist/index.html', '../story/'];

task(function transpileJS() {
    return src('src/js/**/*.js')
        .pipe(concat('story.min.js'))
        .pipe(babelConfig.javascript.transpile ? babel({
            presets : [
                ['@babel/preset-env', {
                    targets: babelConfig.browsers
                }]
            ]
        }) : noop())
        .pipe(babelConfig.javascript.minify ? 
            uglify().on('error', (e) => {console.log(e)}) : noop())
        .pipe(dest('story/modules'))
})

task(function buildTwee() {
    return spawn(command,args,options)
})

task(function buildSass() {
    return src('src/sass/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename('main.min.css'))
        .pipe(dest('story/modules'))
})

task(function watching() {
    watch('src/js', task('transpileJS'))
    watch('src/sass', task('buildSass'))
    watch('story',{ignoreInitial:false}, task('buildTwee'))
})

task('watchDev', series('transpileJS','buildSass','watching'))

task('default', task('watchDev'))