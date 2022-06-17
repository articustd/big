const   { src, dest, watch, series, task } = require('gulp'),
        sass = require('gulp-sass')(require('sass')),
        rename = require('gulp-rename'),
        noop = require('gulp-noop'),
        file = require('gulp-file'),
        webpack = require('webpack-stream'),
        compiler = require('webpack'),
        { spawn } = require('child_process'),
        { platform } = require('os'),
        path = require('path'),
        browserSync = require('browser-sync').create(),
        command = `${(platform() == 'win32')?'tweego.exe':'./tweego'}`, 
        options = {cwd:path.resolve(__dirname,'vendor'), stdio: 'inherit'},   
        args = ['--format=sugarcube-2', '--output=../dist/index.html', '../story/'];

// Compile SASS into working CSS
task(function buildSass() {
    return src('src/sass/main.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename('main.min.css'))
        .pipe(dest('story/modules'))
})

// Bundle JS into story dir
task(function bundle() {
    return src('src/js/index.js')
        .pipe(webpack(require('./webpack.config.js'),compiler,function(err, stats){}))
        .pipe(rename('story.bundle.js'))
        .pipe(dest('story/modules'))
})

// Build with Tweego
task(function buildTwee() {
    return spawn(command,args,options)
})

// Configure Environments
task(function configDev() {
    let config = '{"history": {"controls": true, "maxStates": 40 }, "debug": true, "logging": true }'
    return writeConfig(config)
})

task(function configProd() {
    let config = '{"history": {"controls": false, "maxStates": 2 }, "debug": false, "logging": false }'
    return writeConfig(config)
})

function writeConfig(config) {
    return src('src/**.js')
        .pipe(file('config.json', config))
        .pipe(dest('src/js'))
}

function serve(cb) {
    browserSync.init({
        server: "./dist",
        port: 8080,
        host: "localhost"
    }, cb)
}

function reload(cb) {
    browserSync.reload()
    cb()
}

// Watch Tasks
task(function watching() {
    watch('src/js', task('bundle'))
    watch('src/sass', task('buildSass'))
    watch('story', series('buildTwee',reload))
})

task('build', series('bundle','buildSass','buildTwee'))

task('watchDev', series('bundle','buildSass', 'buildTwee', serve, 'watching'))
task('default', task('watchDev'))