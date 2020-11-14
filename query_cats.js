/*
	Copyright @2019 [Amazon Web Services] [AWS]

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

	    http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/
exports.handler = function(event, context, callback){
    var
        AWS = require("aws-sdk"),
        DDB = new AWS.DynamoDB({
            apiVersion: "2012-08-10",
            region: "us-west-2"
        });

    function queryIndex(breed_str, cb){
        var
            params = {
                ExpressionAttributeValues: {
                    ":breed": {
                        S: breed_str
                    }
                },
                KeyConditionExpression: "breed = :breed",
                TableName: "lostcats",
                IndexName: "breed_index"
            };
            
         DDB.query(params, function(err, data){
             var
                cat_reply_arr = [];
             if(err){
                 throw err;
             }
             if(data.Items.length === 0){
                 throw "You passed in a breed we don't have"; //break hard here
             }
             for(var i_int = 0; i_int < data.Items.length; i_int += 1){
                cat_reply_arr.push(data.Items[i_int]);
             }
             cb(null, cat_reply_arr);
         });
    }

    function scanTable(cb){
         var
            params = {
                TableName: "lostcats"
            };
         DDB.scan(params, function(err, data){
             if(err){
                 throw err;
             }
             cb(null, data.Items);
         });
    }

    (function init(){
        var
            breed_str = "all",
            cb = null;
        if(process.argv[2] !== undefined){
            console.log("Local test for " + process.argv[2]);
            breed_str = process.argv[2];
            cb = console.log;
        }else{
            console.log("Running in lambda");
            console.log(event);
            cb = callback; //becomes available in lambda
            breed_str = event.breed_str;
        }
        if(breed_str === "All"){
            scanTable(cb);
        }else{
            queryIndex(breed_str, cb);
        }
    })();
};
