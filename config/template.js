'use strict';
var nunjucks = require('nunjucks');
// Basic template description.
exports.description = 'this will config your blogist';

// Template-specific notes to be displayed after question prompts.
exports.after = 'run "python -m SimpleHTTPServer" and check if http://localhost:8000 is ok';

// Any existing file or directory matching this wildcard will cause a warning.
// exports.warnOn = '*';

// The actual init template.
exports.template = function(grunt, init, done) {
	var settingsPath = "config/settings.json";
	function config(err, props) {
		// Files to copy (and process).
		var files = init.filesToCopy(props);

		// Actually copy (and process) files.
		init.copyAndProcess(files, props);
		props.settings=true;
		var travis = nunjucks.render("config/.travis.yml",props);
		var gruntfile = nunjucks.render("config/Gruntfile.js",props);
		var index = nunjucks.render("config/index.html",props);
		var crawl = nunjucks.render("config/crawl.js",props);
		var configtravis = nunjucks.render("config/configtravis.sh",props);

		// init.writePackageJSON('Gruntfile.js',gruntfile);
		grunt.file.write(".travis.yml",travis);
		grunt.file.write("Gruntfile.js",gruntfile);
		grunt.file.write("index.html",index);
		grunt.file.write("crawl.js",crawl);
		grunt.file.write("configtravis.sh",configtravis);

		// All done!
		grunt.file.write(settingsPath, JSON.stringify(props,null,2));

		grunt.verbose.or.ok();
		done();
	}
	if (grunt.file.exists(settingsPath)){
		config(null, init.readDefaults(settingsPath));
	}
	else{
	init.process({}, [
		// Prompt for these values.
		init.prompt('github_name'),
		init.prompt('author_name'),
		init.prompt('author_email'),
		init.prompt('blog_title',"Blogist"),
		init.prompt('description',"A blogging framework for real hackers"),
		init.prompt('homepage'),
		init.prompt("theme", "lumen"),
		init.prompt("ghpage_repo"),
		init.prompt("branch", "master"),
		init.prompt("disqus_name"),
		init.prompt("google_analystic")
	], config);
}
	
};
