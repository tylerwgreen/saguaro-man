var execFile	= require('child_process').execFile;

var VideoConverter		= {
	params:	{
		binDir:		'/home/pi/saguaro-man/apps/video-recorder/bin/',
	},
	quit:		function(params){
		console.log('VideoConverter.quit');
		child = execFile(
			VideoConverter.params.binDir + 'video-convert-quit',
			[],
			function(error, stdout, stderr){
				if(error){
					console.log('VideoConverter.quit.error.error');
					console.log(error);
					console.log('VideoConverter.quit.error.stderr');
					console.log(stderr);
					if(typeof params.errorCB !== 'undefined')
						params.errorCB(error);
				}else{
					console.log('VideoConverter.quit.success.stdout');
					console.log(stdout);
					if(typeof params.successCB !== 'undefined')
						params.successCB();
				}
			}
		);
	},
	convert:	function(params){
		console.log('VideoConverter.convert');
		console.log(params.fileName);
		child		= execFile(
			VideoConverter.params.binDir + 'video-convert',
			[params.fileName],
			function(error, stdout, stderr){
				if(error){
					console.log('VideoConverter.convert.error.error');
					console.log(error);
					console.log('VideoConverter.convert.error.stderr');
					console.log(stderr);
					params.errorCB(error);
				}else{
					console.log('VideoConverter.convert.success.stdout');
					console.log(stdout);
					params.successCB();
				}
			}
		);
	},
	delete:	function(params){
		console.log('VideoConverter.delete');
		console.log(params.fileName);
		child		= execFile(
			VideoConverter.params.binDir + 'video-delete',
			[params.fileName],
			function(error, stdout, stderr){
				if(error){
					console.log('VideoConverter.delete.error.error');
					console.log(error);
					console.log('VideoConverter.delete.error.stderr');
					console.log(stderr);
					params.errorCB(error);
				}else{
					console.log('VideoConverter.delete.success.stdout');
					console.log(stdout);
					params.successCB();
				}
			}
		);
	}
};
module.exports = VideoConverter;