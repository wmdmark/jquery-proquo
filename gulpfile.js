var gulp = require("gulp")
var coffee = require("gulp-coffee")
var gutil = require("gulp-util")

gulp.task("build", function(){
  gulp.src("./jquery.proquo.coffee")
    .pipe(coffee({bare:true}).on('error', gutil.log))
    .pipe(gulp.dest("."))
})

gulp.task("watch", function(){
  gulp.watch('./jquery.proquo.coffee', ['build'])
})

gulp.task("default", ['build', 'watch'])
