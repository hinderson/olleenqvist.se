var webpack = require('webpack');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');

module.exports = {
	entry: {
		default: './assets/js/main.js',
	},
	output: {
		filename: '[name].js',
		path: './dist/js',
		publicPath: '/js/'
	},
	plugins: [commonsPlugin],
	resolve: {
	    extensions: ['', '.js', '.json', '.coffee'],
	}
};
