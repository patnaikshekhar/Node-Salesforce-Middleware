var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var jsforce = require('jsforce');
var salesforceConnection = new jsforce.Connection();

var salesforceUsername = process.env.SF_USERNAME;
var salesforcePassword = process.env.SF_PASSWORD;

var returnError = function(response, err) {
	console.error(err);
	response.send({
		error: err
	});
};

var returnSuccess = function(response, result) {
	response.send({
		error: null,
		result: result
	})
};

app.use(bodyParser.json());
app.set('port', (process.env.PORT || 5000));
app.set('salesforceUsername', salesforceUsername);
app.set('salesforcePassword', salesforcePassword);

app.get('/', function(request, response) {
	
	try {
		var query = request.query.q;

		if (!query) {
			returnError(response, 'Query parameter missing');
		} else {
			salesforceConnection.login(
				app.get('salesforceUsername'), 
				app.get('salesforcePassword'), 
				function(err) {
					if (err) {
						returnError(response, err); 
					} else {
						salesforceConnection.query(query, function(err, result) {
							if (err) { 
								returnError(response, err); 
							} else {
								returnSuccess(response, result);
							}
						});
					}
			});	
		}
	} catch(e) {
		returnError(response, err);
	}
});

app.put('/', function(request, response) {
	
	try {
		var data = request.body;
		var obj = data['sobject'];
		var objects = data['objects'];

		salesforceConnection.login(
			app.get('salesforceUsername'), 
			app.get('salesforcePassword'), 
			function(err) {
				if (err) {
					returnError(response, err);
				} else {
					salesforceConnection.sobject(obj).create(objects, function(err, result) {
						if (err) {
							returnError(response, err);
						} else {
							var ids = [];
							result.forEach(function(record) {
								ids.push(record.id);
							});

							returnSuccess(response, ids);
						}
					});
				}
		});

	} catch(e) {
		returnError(response, e.message);
	}

});

app.post('/', function(request, response) {
	
	try {
		var data = request.body;
		var obj = data['sobject'];
		var objects = data['objects'];
		var externalId = data['externalId'];

		salesforceConnection.login(
			app.get('salesforceUsername'), 
			app.get('salesforcePassword'), 
			function(err) {
				if (err) {
					returnError(response, err);
				} else {
					salesforceConnection.sobject(obj).upsert(objects, externalId, function(err, result) {
						if (err) {
							returnError(response, err);
						} else {
							returnSuccess(response, result);
						}
					});
				}
		});

	} catch(e) {
		returnError(response, e.message);
	}

});

var server = app.listen(app.get('port'), function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Listening on http://%s:%s', host, port);
});