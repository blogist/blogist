module.exports = function(grunt) {
  "use strict";

	grunt.initConfig({
    nunjucks: {
      precompile: {
        src: 'src/templates/*',
        dest: 'javascripts/templates.js'
      }
    },
		copy: {
      javascripts: {
        files: [{
          src     : ['src/**/*.js'], 
          dest    : 'javascripts/',
          flatten : true,
          expand  : true
        }]
      }
		},
		mocha: {
			test: {
				src: ['tests/*.html']
			},
			 options: {
				 run: true
			 }
		},
		uglify:{
			blogist:{
				src:['src/blogist.js'],
				dest:"javascripts/blogist.js"
			}
		},
		watch:{
			scripts: {
				files: ['src/**/*'],
				tasks:['default']
			}
		},
		sitemap: {
      dist: {
        siteRoot: './',
				pattern:'/jcouyang/*.html',
				homepage:"http://localhost:8000"
      }
    }
	});
	grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-nunjucks');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-mocha');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-sitemap');
	grunt.registerTask('deploy', ['nunjucks', 'copy', 'mocha', 'uglify',"sitemap"]);
	grunt.registerTask("default", ['nunjucks', 'copy']);
};
