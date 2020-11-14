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
var
    AWS = require("aws-sdk"),
    DDB = new AWS.DynamoDB({
        apiVersion: "2012-08-10",
        region: "us-west-2"
    }),
    CAT_DATA_ARR = require("./cat_data.json");

function addNewItemsFromJSON(){
	console.log("All items now removed, re-seeding now");
	var 
		cat = {},
		cat_formatted_arr = [],
		params = {};


	for(var i_int = 0; i_int < CAT_DATA_ARR.length; i_int += 1){
		cat = {
	    	PutRequest: {
	    		Item: {
	    			petname: {
	    				"S": CAT_DATA_ARR[i_int].petname_str
	    			},
	    			breed: {
	    				"S": CAT_DATA_ARR[i_int].breed_str
	    			},
	    			gender: {
	    				"S": CAT_DATA_ARR[i_int].gender_str
	    			},
	    			data_found: {
	    				"S": CAT_DATA_ARR[i_int].date_found_str
	    			},
	    			notable_features: {
	    				"S": CAT_DATA_ARR[i_int].notable_features_str
	    			}
	    		}
	    	}
	    };
	    cat_formatted_arr.push(cat);
	}
	params = {
		RequestItems: {
			"lostcats": cat_formatted_arr.reverse()
		}
	};
	DDB.batchWriteItem(params, function(err, data){   
		if(err){
			throw err;
		}
		console.log("OK");         
	});
}

(function init(){
	addNewItemsFromJSON();
})();