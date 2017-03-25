/**
 * Include dependencies
 */
var debug	= require('debug')('media_player');
var express	= require('express');
var fs		= require('fs');
var morgan	= require('morgan');
var path	= require('path');
var rfs		= require('rotating-file-stream');
var paths	= {
	app:	'/app/',
	models:	'/app/models/',
	views:	'/app/views/',
	logs:	'/logs/',
	web:	'/web/',
};
var styling	= false;
// var styling	= true;

/**
 * Load models
 */
var MediaPlayer		= require(path.join(__dirname, paths.models, 'MediaPlayer'));
MediaPlayer.init();

// app settings
/**
 * App Settings
 */
var port		= 5000
var logger		= {
	// debug:		true,
	debug:		false,
	format:		'combined',	// DEFAULT - Standard Apache combined log output.
	// format:		'tiny',		// The minimal output.
	// format:		'dev',		// Concise output colored by response status for development use.
	options:	{
		skip: function(req, res){
			// only log error responses
			if(!logger.debug)
				return res.statusCode < 400
		},
	},
	stream:		{
		file:		'access.log',
		config:		{
			interval:	'1d', // rotate daily 
			path:		path.join(__dirname, paths.logs),
		}
	},
}

/**
 * Start app
 */
var app = express();

/**
 * Middleware
 */
// ensure log directory exists
fs.existsSync(logger.stream.config.path) || fs.mkdirSync(logger.stream.config.path)
// create a rotating write stream
var accessLogStream = rfs(logger.stream.file, logger.stream.config)
logger.options.stream = accessLogStream;
// setup the logger
app.use(morgan(logger.format, logger.options))

/**
 * Routes
 */
// static files
app.use(express.static(path.join(__dirname, paths.web)));
app.get('/', function(req, res, next){
	res.sendFile(path.join(__dirname, paths.views, 'index.html'));
});
/** Expressions */
app.post('/apps/expressions/play', function(req, res, next){
	console.log('/apps/expressions/play');
	// console.log(req.params);
	if(styling){
		setTimeout(function(){
			console.log('/apps/expressions - success');
			res.json({
				data:	{
					success:	true,
				}
			});
		}, 5000);
	}else{
		MediaPlayer.expressions.play({
			errorCB:	function(error){
				console.log('/apps/expressions/play - errorCB');
				console.log(error);
				res.status(500).json({
					errors: ['Expressions play failed'],
				});
			},
			successCB:	function(){
				console.log('/apps/expressions/play - successCB');
				res.json({
					data:	{
						success:	true,
					}
				});
			}
		});
	}
});
/** Puppet People */
app.post('/apps/puppet-people/play', function(req, res, next){
	console.log('/apps/puppet-people/play');
	// console.log(req.params);
	if(styling){
		setTimeout(function(){
			console.log('/apps/puppet-people - success');
			res.json({
				data:	{
					success:	true,
				}
			});
		}, 5000);
	}else{
		MediaPlayer.puppetPeople.play({
			errorCB:	function(error){
				console.log('/apps/puppet-people/play - errorCB');
				console.log(error);
				res.status(500).json({
					errors: ['Puppet People play failed'],
				});
			},
			successCB:	function(){
				console.log('/apps/puppet-people/play - successCB');
				res.json({
					data:	{
						success:	true,
					}
				});
			}
		});
	}
});
/** Dusty Loops */
app.post('/apps/dusty-loops/play', function(req, res, next){
	console.log('/apps/dusty-loops/play');
	// console.log(req.params);
	if(styling){
		setTimeout(function(){
			console.log('/apps/dusty-loops - success');
			res.json({
				data:	{
					success:	true,
				}
			});
		}, 5000);
	}else{
		MediaPlayer.dustyLoops.play({
			errorCB:	function(error){
				console.log('/apps/dusty-loops/play - errorCB');
				console.log(error);
				res.status(500).json({
					errors: ['Dusty Loops play failed'],
				});
			},
			successCB:	function(){
				console.log('/apps/dusty-loops/play - successCB');
				res.json({
					data:	{
						success:	true,
					}
				});
			}
		});
	}
});
app.post('/quit', function(req, res, next){
	console.log('/quit');
	// console.log(req.params);
	if(styling){
		res.json({
			data:	{
				success:	true,
			}
		});
	}else{
		MediaPlayer.quit({
			errorCB:	function(error){
				console.log('/quit - errorCB');
				console.log(error);
				res.status(500).json({
					errors: ['Quit failed'],
				});
			},
			successCB:	function(){
				console.log('/quit - successCB');
				res.json({
					data:	{
						success:	true,
					}
				});
			}
		});
	}
});

/**
 * 404's - forward to error handler
 */
app.use(function(req, res, next){
	// console.log(req.url);
	var err = new Error('Not Found:' + req.url);
	err.status = 404;
	next(err);
});

/**
 * Error handler
 */
app.use(function(err, req, res, next){
	console.log('Error: ' + err.message);
	res.status(err.status || 500);
	var msg = err.message || 'Unknown error';
	// for json errors
	if(req.xhr) {
		res.json({
			errors: [msg]
		})
	}else{
		res.send('Error: ' + msg);
	}
});

/**
 * Server
 */
var server = app.listen(port, function(){
	var host = server.address().address || 'localhost'
	var port = server.address().port
	debug('Example app listening at http://%s:%s', host, port);
});
module.exports = app, debug;