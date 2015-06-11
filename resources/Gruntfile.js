/**
 * Grunt Configuration
 * @param grunt
 *
 * @author DOCONO <hello@docono.io>
 * @version 1.0
 */


module.exports = function (grunt) {

    // Globals
    var globalConfig = {
        css: '../public_html/static/css',
        scss: 'static/scss',
        scripts: '../public_html/static/js',
        scripts_src: 'static/js',
        images: '../public_html/static/img',
        images_src: 'static/img',
        foundation_scss: 'bower_components/foundation/scss',
        foundation_src: 'bower_components/foundation/js',
        jquery_src: 'bower_components/jquery/dist'
    };


    // init
    grunt.initConfig({
        globalConfig: globalConfig,
        pkg: grunt.file.readJSON('package.json'),

        // SASS
        sass: {
            options: {
                includePaths: ['<%= globalConfig.foundation_scss %>']
            },
            dist: {
                files: {
                    '<%= globalConfig.css %>/app.css': '<%= globalConfig.scss %>/app.scss'
                },
                options: {
                    outputStyle: 'compressed', // 'expanded', 'nested', 'compressed', 'compact'
                    // SourceMap for Debug
                    sourceMap: false
                }
            }
        },

        // CONCATINATE
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [
                    '<%= globalConfig.jquery_src %>/jquery.js',
                    '<%= globalConfig.scripts_src %>/**/*.js'
                ],
                dest: '<%= globalConfig.scripts %>/main.min.js'
            }
        },

        // MINIFY
        uglify: {
            production: {
                options: {
                    // SourceMap for Debug
                    sourceMap: false
                },
                files: {
                    '<%= globalConfig.scripts %>/main.min.js': ['<%= globalConfig.scripts %>/main.min.js']
                }
            }
        },


        // WATCHER
        watch: {
            // Beim Speichern von .scss Dateien
            css: {
                files: ['<%= globalConfig.scss %>/**/*.scss'],
                tasks: ['sass']
            },
            // Beim Speichern von .js Dateien
            scripts: {
                files: [
                    '<%= globalConfig.jquery_src %>/jquery.js',
                    '<%= globalConfig.scripts_src %>/**/*.js'
                ],
                tasks: ['concat', 'uglify']
            }
        },

        // RESPONSIV IMAGES
        responsive_images: {
            retina: {
                options: {
                    // Benutze Library: im = ImageMagick, gm = GraphicsMagick
                    engine: 'gm',
                    separator: '',
                    sizes: [{
                        // Original-Namen behalten
                        rename: false,
                        quality: 85,
                        // Die Bilder werden in ihrer Größe halbiert.
                        width: '50%'
                    },{
                        rename: false,
                        quality: 85,
                        width: '100%',
                        // Für die Retina-Bilder wird ein Suffix vergeben,
                        // das an den Originalnamen angehängt wird.
                        suffix: '@2x'
                    }]
                },
                files: [{
                    expand: true,
                    // Welche Dateitypen sollen von diesem Task überhaupt betroffen sein?
                    src: ['**/**.{jpg,gif,png}'],
                    // Ausgangsorder, hier liegen die Originaldateien.
                    cwd: '<%= globalConfig.images_src %>/',
                    // Zielordner, hier werden die Bilder abgelegt.
                    dest: '<%= globalConfig.images %>/'
                }]
            }
        },

        // IMAGE MINIMIZER
        imagemin: {
            png: {
                options: {
                    optimizationLevel: 7
                },
                files: [{
                    expand: true,
                    src: ['**/*.png'],
                    cwd: '<%= globalConfig.images %>',
                    dest: '<%= globalConfig.images %>'
                }]
            },
            jpg: {
                options: {
                    progressive: true
                },
                files: [{
                    expand: true,
                    src: ['**/*.{jpg,jpeg}'],
                    cwd: '<%= globalConfig.images %>',
                    dest: '<%= globalConfig.images %>'
                }]
            }
        },

        // FAVICON GENERATOR
        favicons: {
            options: {
                // Hintergrundfarbe für das Apple Touch Icon
                appleTouchBackgroundColor: "#000000",
                // Erstelle ein Icon für den Android Home Screen
                androidHomescreen: true,
                // Erstelle eine HTML-Datei, in der allen notwendigen Meta-Tags eingebunden sind.
                html: '<%= globalConfig.images %>/favicon.html',
                HTMLPrefix: "",
                // Tile Farbe für Windows
                tileColor: "#000000",
                // Das muss auf false gesetzt werden, damit die tileColor Einstellung greift.
                tileBlackWhite: false
            },
            icons: {
                src: '<%= globalConfig.images_src %>/favicon.png',
                dest: '<%= globalConfig.images %>'
            }
        },

        // BROWSER SYNC
        browserSync: {
            // Wenn Änderungen an diesen Dateien festegestellt werden, lade alle Fenster neu!
            bsFiles: {
                src : [
                    '../public_html/css/*.css',
                    '../public_html/*.html'
                ]
            },
            options: {
                debugInfo: true,
                logConnections: true,
                notify: true,
                // Wie die Webseite im Browser aufgerufen wird.
                // Kann ebenso localhost oder eine IP sein.
                // ACHTUNG: Domains mit .local funktionieren nicht richtig!
                proxy: "grunt-webseite.dev",
                // Öffne die Seite in folgenden Browsern
                browser: ["google chrome", "firefox"],
                ghostMode: {
                    // Scrolle auf allen Geräten
                    scroll: true,
                    // Folge den Links auf allen Geräten
                    links: true,
                    // Fülle die Formulare auf allen Geräten aus
                    forms: true
                }
            }
        },

        // SHELL TASKS
        shell: {
            cockpit: {
                command: [
                    'cd ..',
                    'git submodule add https://github.com/aheinze/cockpit.git',
                    'git checkout tags/0.13.0'
                ].join('&&')
            }
        }


    });

    // Load NPM Tasks
    require('load-grunt-tasks')(grunt);

    // Register Tasks
    grunt.registerTask('Watch', ['watch']);
    grunt.registerTask('Optimize-Images', ['responsive_images', 'imagemin']);
    grunt.registerTask('Generate-Touch-Icons', ['favicons']);
    grunt.registerTask('Browser-Sync', ['browserSync']);
    grunt.registerTask('Cockpit-CMS', ['shell:cockpit']);

};