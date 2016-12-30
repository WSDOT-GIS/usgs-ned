module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt)

  grunt.initConfig({
    babel: {
      dist: {
        files: [{
          expand: true,
          cwd: 'es2015',
          src: '**/*.js',
          ext: '.js'
        }]
      }
    },
    copy: {
      default: {
        files: [{
          expand: true,
          cwd: 'es2015',
          dest: '.',
          src: '**/*.d.ts',
          ext: '.d.ts'
        }]
      }
    },
    clean: {
      before: [
        "es2015",
        "**/{.baseDir,usgsNed,ElevationQueryResult,*Spec}.{js,d.ts}"
      ],
      after: [
        "**/.baseDir.*",
        "**/*Spec.d.ts"
      ],
      afterCopy: [
        "es2015/**/*.d.ts"
      ]
    },
    concat: {
      dist: {
        src: ["src/fetch-snippet.js", "usgsNed.js"],
        dest: "usgsNed.js"
      }
    },
    jasmine: {
      src: "*.js",
      options: {
        specs: "spec/**/*Spec.js",
        polyfills: [
          "node_modules/core-js/client/shim.min.js",
          "node_modules/whatwg-fetch/fetch.js"
        ]
      }
    },
    ts: {
      default: {
        tsconfig: true
      }
    }
  })

  grunt.registerTask('default', ['clean:before', 'ts', 'clean:after', 'babel', 'copy', 'clean:afterCopy', 'concat'])
  grunt.registerTask('test', ['jasmine'])
}