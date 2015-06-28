
	var helpers = require("../helpers");
	var Queue = require("queuemanager");
	var SQSCommand = require("../sqscommand");

	var AWS_CONFIG_FILE = "./config.json";
	var APP_CONFIG_FILE = "./app.json";


var task = function(request, callback){
	
		var AWS = require("aws-sdk");
		AWS.config.loadFromPath(AWS_CONFIG_FILE);		

	//var s3 = new AWS.S3(); 

	var appConfig = helpers.readJSONFile(APP_CONFIG_FILE);
	var queue = new Queue(new AWS.SQS(), appConfig.QueueUrl);
	var sqsCommand = new SQSCommand(queue);
	queue.sendMessage(request.query.bucket+':'+request.query.key, function(err, data)
	{
		if(err) { callback(err); return; }
		else {callback(null, data.MD5OfMessageBody)}
	});
	

		
}


exports.action = task;



