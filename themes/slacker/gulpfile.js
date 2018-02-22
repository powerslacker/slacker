// based on guide @ http://danbahrami.io/articles/building-a-production-website-with-hugo-and-gulp-js/

var gulp = require("gulp"),
  sass = require("gulp-sass"),
  autoprefixer = require("gulp-autoprefixer")

// Compile SCSS files to CSS
gulp.task("scss", function () {
  gulp.src("static/sass/**/*.scss")
    .pipe(sass({
      outputStyle: "compressed"
    }))
    .pipe(autoprefixer({
      browsers: ["last 20 versions"]
    }))
    .pipe(gulp.dest("static/css"))
})

// Watch asset folder for changes
gulp.task("watch", ["scss"], function () {
  gulp.watch("static/sass/**/*", ["scss"])
})

// Set watch as default task
gulp.task("default", ["watch"])