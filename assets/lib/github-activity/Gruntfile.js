module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfile.js', 'src/*.js']
    },
    uglify: {
      githubActivity: {
        files: {
          'dist/githubActivity.min.js': 'src/githubActivity.js'
        }
      }
    },
    jasmine: {
      githubActivity: {
        src: 'src/*.js',
        options: {
          specs: 'spec/*Spec.js',
          vendor: [
            'bower_components/mustache/mustache.js',
            'bower_components/momentjs/moment.js'
          ]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['jshint', 'jasmine', 'uglify']);
  grunt.registerTask('test', ['jshint', 'jasmine']);
};
