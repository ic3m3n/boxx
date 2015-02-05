module.exports = function(grunt) {

    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('assemble');

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        banner: [
            '/*!',
            '<%= pkg.name %>',
            '@version <%= pkg.version %>',
            '@date <%= grunt.template.today("yyyy-mm-dd, HH:MM") %>',
            '*/'
        ].join("\n"),


        jshint: {
            files: [
                'Gruntfile.js',
                'src/js/main.js'
            ]
        },

        concat: {
            main: {
                src: 'src/js/main.js',
                dest: 'dist/<%= pkg.name %>.js'
            }
        },

        uglify: {
            js: {
                options: {
                    banner: "<%= banner %>\n"
                },
                files: [{
                    expand: true,
                    cwd: 'dist',
                    src: ['*.js', '!*.min.js'],
                    dest: 'dist',
                    ext: '.min.js'
                }]
            }
        },

        connect: {
            server: {
                options: {
                    hostname: '*'
                }
            }
        },

        clean: {
            dist: 'dist',
            build: [
                'dist/tmp',
                'dist/css/*.map', 
                'dist/css/*.css', 
                '!dist/css/*.min.css', 
                'dist/js/*.js', 
                '!dist/js/*.min.js'
            ]
        },

        watch: {

            js: {
                files: '<%= jshint.files %>',
                tasks: ['jshint', 'concat'],
                options: {
                    livereload: true
                }
            }
        }

    });

    grunt.registerTask('build', ['clean', 'jshint', 'concat', 'uglify']);
    grunt.registerTask('compile', ['concat']);
    grunt.registerTask('server', ['connect', 'watch']);
    grunt.registerTask('default', ['compile' ,'server']);
};
