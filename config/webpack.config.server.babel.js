import { server } from 'universal-webpack/config'
import settings from './universal-webpack-settings'
import configuration from './webpack.config.dev'

export default server(configuration, settings)