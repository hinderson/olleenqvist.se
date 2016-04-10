var webpack = require('webpack');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');

module.exports = {
	entry: {
		default: './assets/js/main.js',
	},
	output: {
		filename: 'main.js',
		path: './dist/js',
		publicPath: '/dist/js/'
	},
	plugins: [],
	resolve: {
	    extensions: ['', '.js', '.json', '.coffee'],
		alias: {
			'eventEmitter/EventEmitter': 'wolfy87-eventemitter'
		}
	},
	module: {
		loaders: [
			{
				test: /(flickity|fizzy-ui-utils|get-size|unipointer)/,
        		loader: 'imports?define=>false&this=>window'
			}
		]
	}
};
