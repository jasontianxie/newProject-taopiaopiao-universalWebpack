// express.js
import path from 'path';
import http from 'http';
import * as React from 'react';
import express from 'express';
const { match, RouterContext } = require('react-router');
const { Provider } =require('react-redux');
const {renderToString} = require('react-dom/server');
const { createStore, applyMiddleware } = require('redux');
// const rootReducer = require('../src/reduxReducer/combineReducer.ts');
import rootReducer from '../src/reduxReducer/combineReducer.ts';
const thunk = require('redux-thunk').default;
const store = createStore(rootReducer, applyMiddleware(thunk));

// const webpack = require('webpack');
// const webpackDevConfig = require('../config/webpack.config.dev');
// const webpackDevMiddleware = require('webpack-dev-middleware');
// const compiler = webpack(webpackDevConfig);

// react-router
import routes from '../routes/iso-routes.js';

// Redux
// import store from '../client/store.js';

// The server code must export a function
// (`parameters` may contain some miscellaneous library-specific stuff)
export default function(parameters)
{
	// Create HTTP server
	const app = new express();
	// const server = new http.Server(app)
	// console.log('process.cwd()');
	// console.log(process.cwd());
	// Serve static files
	
	// app.get('*',(req,res)=>{
	// 	var options = {
	// 		root: path.resolve(__dirname, '../client'),
	// 		dotfiles: 'deny'
	// 	  };
	// 		var urlArr = req.originalUrl.split('/');
	// 	  var fileName = urlArr[urlArr.length-1];
	// 	  console.log('fileName');
	// 	  console.log(fileName);
	// 	  if(fileName){
	// 		res.sendFile(fileName, options, function (err) {
	// 			if (err) {
	// 			  next(err);
	// 			} else {
	// 			  console.log('Sent:', fileName);
	// 			}
	// 		  });
	// 	  }
		  
		
	// })
	// Proxy API calls to API server
	// const proxy = http_proxy.createProxyServer({ target: 'http://localhost:xxxx' })
	// app.use('/api', (req, res) => proxy.web(req, res))

	// app.use(webpackDevMiddleware(compiler, {
	// 	publicPath: webpackDevConfig.output.publicPath
	//   }));
	//   app.use(require("webpack-hot-middleware")(compiler));
	// React application rendering
	
	app.use((req, res,next) =>
	{
		// Match current URL to the corresponding React page
		// (can use `react-router`, `redux-router`, `react-router-redux`, etc)
		match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
			// console.log(renderProps);
			// console.log(routes);
			// console.log(req.url);
			if (error) {
				res.status(500).send(error.message)
			} else if (redirectLocation) {
				res.redirect(302, redirectLocation.pathname + redirectLocation.search)
			} else if (renderProps) {
				res.status(200).send(template(renderProps,parameters.chunks()))
			} else {
				// res.status(404).send('Not found'+renderProps)
				next();
			}
		});
	})

	app.use(express.static(process.cwd()+'/public/'));

	// Start the HTTP server
	var port = '3005';
	app.listen(port,(err)=>{
		if(err){
			console.log('error is occour:'+err)
		}else{
			console.log('server is success at:'+port);
		}
	})
}

function template(renderProps,chunks) {
	// console.log('chunks:');
	// console.log(chunks);
    return (`
    <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="initial-scale=1, maximum-scale=1,width=device-width,user-scalable=no">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Document</title>
        </head>
        <body>
            <div id="root">${renderToString(<Provider store={store}><RouterContext {...renderProps} /></Provider>)}</div>
            <script type="text/javascript">
                window.onresize = function(){
                document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 + 'px';
                }
                document.addEventListener('DOMContentLoaded',function(){
                document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 + 'px';
                },false);
            </script>
            <script type="text/javascript" src=${chunks.javascript.app}></script>
            <script type="text/javascript" src=${chunks.javascript.vendor}></script>
        </body>
        </html>
    `)
}