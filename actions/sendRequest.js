var helpers = require("../helpers");
var template = "send.ejs";
var AWS = require("aws-sdk");
var configFilePath = "config.json";
var appConfig = {
	"QueueUrl" : "https://sqs.us-west-2.amazonaws.com/983680736795/leszczynskaSQS"
}
var Queue = require("queuemanager");

exports.action = function(request, callback) {

	AWS.config.loadFromPath(configFilePath);
	var keys = request.query.selected;
	var that = this;
	keys = Array.isArray(keys)?keys:[keys];
	var redirect = false;
	keys.forEach(function(key){
		var queue = new Queue(new AWS.SQS(), appConfig.QueueUrl);
		queue.sendMessage(key, function(err, data){
			var simpledb = new AWS.SimpleDB();
			
			var dbParams = {
				Attributes: [{
					Name:"key",
					Value: key,
					Replace: false
				}],
				DomainName: 'leszczynska_project', /* required */
				ItemName: "Wyslano na kolejke" /* required */
			};
			simpledb.putAttributes(dbParams, function(err, data) {
				redirect = true;
			});

		});
	});

	if(redirect){
		var res = request.res;
		res.statusCode = 302; 
		res.setHeader("Location", "/?success");
		res.end();
	}

}
