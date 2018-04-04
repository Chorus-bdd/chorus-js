// import dependencies
const path = require('path');
const webpack = require('webpack');


// paths
const srcPath = path.resolve('./src');
const exampleRootPath = path.resolve('./example');
const exampleAppPath = path.resolve(exampleRootPath, 'index');


// webpack configuration
const config = {
	entry: exampleAppPath,
	output: {
		filename: 'bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: [srcPath, exampleRootPath],
			},
		],
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
		}),
	],
	devtool: 'cheap-module-source-map',
	devServer: {
		contentBase: exampleRootPath,
		port: process.env.PORT || 9999,
		disableHostCheck: true,
	},
};


// export configuration
module.exports = config;
