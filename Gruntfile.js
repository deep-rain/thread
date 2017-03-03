module.exports = function(grunt) {
    grunt.initConfig({
        uglify: {
            dist: {
                files: {
                    'dist/thread.min.js': 'src/thread.js'
                },
                options: {
                    sourceMap: true
                }
            },
        },
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['uglify']);
};
