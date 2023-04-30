const { platform } = require('os')
const webpackConfig = require('./webpack.config.js');
const configPath = 'src/js/config.json'

module.exports = function (grunt) {
    grunt.initConfig({
        browserSync: {
            bsFiles: {
                src: 'dist/*'
            },
            options: {
                port: 8080,
                server: "./dist",
                watchTask: true,
            }
        },
        chokidar: {
            sass: {
                files: 'src/**/*.scss',
                tasks: ['buildSass'],
                options: {
                    atBegin: true,
                },
            },
            webpack: {
                files: 'src/**/*.js',
                tasks: ['webpack'],
                options: {
                    atBegin: true,
                },
            },
            tweego: {
                files: 'story/**/*',
                tasks: ['run:tweego'],
                options: {
                    atBegin: true,
                },
            },
        },
        clean: {
            sass: ['story/modules/main.min.css.map']
        },
        run: {
            tweego: {
                cmd: `./vendor/${(platform() == 'win32') ? 'tweego.exe' : 'tweego'}`,
                args: [
                    '--format=sugarcube-2',
                    '--output=./dist/index.html',
                    './story/'
                ]
            }
        },
        sass: {
            dist: {
                options: {
                    style: 'compressed',
                },
                files: {
                    "story/modules/main.min.css": "src/sass/main.scss"
                }
            }
        },
        webpack: {
            myConfig: webpackConfig,
        },
    });

    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-chokidar');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-run');
    grunt.loadNpmTasks('grunt-webpack');

    grunt.registerTask('configDev', 'Creates Dev Configurations', function () {
        grunt.file.write(configPath, '{"history": {"controls": true, "maxStates": 40 }, "debug": true, "logging": true }');
    });
    grunt.registerTask('configProd', 'Creates Dev Configurations', function () {
        grunt.file.write(configPath, '{"history": {"controls": false, "maxStates": 2 }, "debug": false, "logging": false }');
    });

    grunt.registerTask('buildSass', 'Build SASS file without map file', function () {
        grunt.task.run('sass', 'clean:sass')
    })

    grunt.registerTask('build', 'Build a working html file with bundle and css', ['buildSass', 'webpack', 'run:tweego'])
    grunt.registerTask('default', 'Default task launches the watching setup', ['browserSync', 'chokidar'])
}