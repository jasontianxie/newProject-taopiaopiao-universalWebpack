const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
  filename: "[name].[contenthash].css",
  disable: process.env.NODE_ENV === "development",
  allChunks: true
});

module.exports = {
  entry: {
    app: ['eventsource-polyfill', path.resolve(__dirname, '../entry/index.tsx'), 'webpack-hot-middleware/client?reload=true'],
    vendor: ['eventsource-polyfill', path.resolve(__dirname, '../entry/vendor.js'), 'webpack-hot-middleware/client?reload=true'],
    // polyfill:'eventsource-polyfill',
  },
  // entry:[
  //   'event-source-polyfill',
  //   'webpack-hot-middleware/client?reload=true',
  //   path.resolve(__dirname,'../entry/index.tsx'),
  //   // path.resolve(__dirname,'../entry/vendor.js')
  // ],
  output: {
    path: path.resolve(__dirname, '../public'),
    filename: 'bundle.[name].js',
    // filename:'[name].js',
    publicPath: ''
  },
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json","scss"],
    alias:{
      src:path.resolve(__dirname, '../src')
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['env','react']
          }
        }]
      },
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
      {
        test:/\.css$/,use:[
          {loader:"style-loader"},
          {
                loader: "css-loader",
              }
        ]
      },
      {
        test:/\.library.scss$/,
        use:[
          {loader:"style-loader"},
          {loader: "css-loader"},
          {
            loader:"postcss-loader"
          },
          {
            loader: "sass-loader"
          }
        ]
      },
      {
        test: /\.scss$/,
        exclude:/\.library.scss$/,
        // use: extractSass.extract({
        //   use: [{
        //     loader: "css-loader",
        //     options:{
        //       modules:true,
        //       importLoaders:2,
        //       localIdentName:'[name]__[local]___[hash:base64:5]'
        //     }
        //   },
        //   {
        //     loader:"postcss-loader"
        //   },
        //   {
        //     loader: "sass-loader"
        //   }],
        //   // use style-loader in development 
        //   fallback: {loader:"style-loader",options:{hmr:true}}
        // })
        use:[
          {loader:"style-loader",options:{hmr:true}},
          {
                loader: "css-loader",
                options:{
                  modules:true,
                  importLoaders:2,
                  localIdentName:'[name]__[local]___[hash:base64:5]'
                }
              },
              {
                loader:"postcss-loader"
              },
              {
                loader: "sass-loader"
              }
        ]
      },
      {
        test: /\.(png|jpg)$/,
        use:[{loader:'url-loader',options:{limit:40000}}]
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader'
      }
    ]
  },
  plugins: [
    // extractSass,
    // new CleanWebpackPlugin(['public'], { root: path.resolve(__dirname, '..') }),
    new webpack.HotModuleReplacementPlugin(),
    // Use NoErrorsPlugin for webpack 1.x
    new webpack.NoEmitOnErrorsPlugin(),
    new htmlWebpackPlugin({
      filename: 'index.html',
      template: 'template.html'
    }),
    new BrowserSyncPlugin(
      // BrowserSync options 
      {
        // browse to http://localhost:3000/ during development 
        host: 'http://127.0.0.1',
        port: 3100,
        // proxy the Webpack Dev Server endpoint 
        // (which should be serving on http://localhost:3100/) 
        // through BrowserSync 
        proxy: 'http://127.0.0.1:3005/'
      },
      // plugin options 
      {
        // prevent BrowserSync from reloading the page 
        // and let Webpack Dev Server take care of this 
        reload: false
      }
    )
  ]
}