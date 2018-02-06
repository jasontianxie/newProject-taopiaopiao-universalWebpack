
// import { client } from 'universal-webpack/config'
// import settings from './universal-webpack-settings'
// import configuration from './webpack.config.dev'
const { client } = require('universal-webpack/config')
const settings = require('./universal-webpack-settings')
const configuration = require('./webpack.config.dev')

// export default client(configuration, settings)
module.exports = client(configuration, settings)