const gulp = require('gulp');

gulp.task('hello', function(done) {
	console.log("Hello from gulp!")
	done()
})

gulp.task('default', gulp.series('hello'));