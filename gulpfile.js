const   { src, dest, watch, series } = require('gulp'),
        { exec, spawn } = require('child_process'),
        { platform } = require('os'),
        path = require('path');

var command = `tweego${(platform() == 'win32')?'.exe':''}`, 
    options = {cwd:path.resolve('vendor'), stdio: 'inherit'},   
    args = ['--format=sugarcube-2', '--output=../dist/index.html', '../story/'];

function buildTwee() {
    return spawn(command,args,options)
}

exports.buildTwee = buildTwee
exports.default = function() {
    watch('src/twee',{ignoreInitial: false},buildTwee)
}