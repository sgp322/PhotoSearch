const AWS = require('aws-sdk');
var elasticsearch = require('elasticsearch');
var lexruntime = new AWS.LexRuntime();

exports.handler = async (event,context, callback) => {
    console.log(event.queryStringParameters.q);
    var serachText = event.queryStringParameters.q;
    var client = new elasticsearch.Client({
      host: 'addr'
    });
    
    var params = {
      botAlias: '$LATEST',
      botName: 'SearchIntent',
      inputText: serachText,
      userId: 'STRING_VALUE'
    };
    return await lexruntime.postText(params)
    .promise()
    .then(data => {
        console.log('data',data.slots); 
        var keywords = [];
        for (var a in data.slots) {
            console.log(data.slots[a]);
            keywords.push(data.slots[a])
        }
        return client.search({
          index: 'photos',
          q: 'labels:' + keywords
        })
    })
    .then(data => {
        var result_arr = [];
        for (var pic of data.hits.hits) {
            result_arr.push({"fileName": pic._source.objectKey, "bucket": pic._source.bucket});
        }
        console.log(result_arr)
        var returnObject ={
            "isBase64Encoded": false,
            "statusCode": "200",
            "headers": { "Access-Control-Allow-Origin": "*"},
            "body": JSON.stringify(result_arr)
        }
        callback(null,returnObject);;
    })
    .catch(error => {
        console.log("in err", error);
    });


    // .catch(error => {
    //     console.log("in err", error);
    // });
    
};
