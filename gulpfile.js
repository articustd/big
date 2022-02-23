const   { src, dest, watch, series, task,  } = require('gulp'),
        sass = require('gulp-sass')(require('sass')),
        rename = require('gulp-rename'),
        { exec, spawn } = require('child_process'),
        { platform } = require('os'),
        path = require('path'),
        command = `tweego${(platform() == 'win32')?'.exe':''}`, 
        options = {cwd:path.resolve('vendor'), stdio: 'inherit'},   
        args = ['--format=sugarcube-2', '--output=../dist/index.html', '../story/'];

task(function buildTwee() {
    return spawn(command,args,options)
})

task(function buildSass() {
    return src('src/sass/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename('main.min.css'))
        .pipe(dest('story/modules'))
})

task(function watchDev() {
    watch('src/sass',{ignoreInitial: false}, task('buildSass'))
    watch('story', task('buildTwee'))
})

task('default', task('watchDev'))