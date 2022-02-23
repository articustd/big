const   { src, dest, watch, series } = require('gulp'),
        sass = require('gulp-sass')(require('sass')),
        rename = require('gulp-rename'),
        { exec, spawn } = require('child_process'),
        { platform } = require('os'),
        path = require('path'),
        command = `tweego${(platform() == 'win32')?'.exe':''}`, 
        options = {cwd:path.resolve('vendor'), stdio: 'inherit'},   
        args = ['--format=sugarcube-2', '--output=../dist/index.html', '../story/'];

function buildTwee() {
    return spawn(command,args,options)
}

function buildSass() {
    return src('src/sass/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename('main.min.css'))
        .pipe(dest('story/modules'));
}

exports.buildTwee = buildTwee
exports.buildSass = buildSass
exports.buildDev = series(buildSass, buildTwee)
exports.watchDev = function() {
    watch('src/sass',{ignoreInitial: false},buildSass)
    watch('story',buildTwee)
}
exports.default = this.watchDev