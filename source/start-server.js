require('../server.babel');
var startServer = require('universal-webpack/server')
var settings = require('../config/universal-webpack-settings')
// `configuration.context` and `configuration.output.path` are used
var configuration = require('../config/webpack.config.dev')

startServer(configuration, settings)