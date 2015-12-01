var webpack = require('webpack');

module.exports = {
	entry: {
		main: './assets/js/main.js'
	},
	output: {
		filename: 'bundle.js',
		path: './dist/js',
		publicPath: '/js/'
	},
	resolve: {
	    extensions: ['', '.js', '.json', '.coffee'],
	}
};
