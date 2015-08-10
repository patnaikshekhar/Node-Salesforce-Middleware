# Node Salesforce Middleware

This is a generic node middleware for Salesforce which allows you to talk to Salesforce using rest services without the need for OAuth. The environment details need to be configured in the environment using the two variables SF_USERNAME and SF_PASSWORD.
This makes it east to implement Mobile and Web Apps.

 * You can use a simple get service appended with the parameter q
 ```sql
http://localhost:8000/q=SELECT Id FROM Account
```
 * You can use a simple put service to insert records with the following json
```json
{
	"sobject": "Account",
    "objects": [
    	{
        	"Name": "Test 1"
        },
        {
        	"Name": "Test 2"
        }
    ]
}
```

 * Additionally you can also perform an upsert using the following code
```json
{
	"sobject": "Account",
    "externalId": "External_Id__c", 
    "objects": [
    	{
        	"Name": "Test 1",
            "External_Id__c": "Acc1"
        },
        {
        	"Name": "Test 2",
            "External_Id__c": "Acc2"
        }
    ]
}
```
* This also contains a Procfile which makes it easy to deploy to Heroku