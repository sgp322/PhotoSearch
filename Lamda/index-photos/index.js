const AWS = require('aws-sdk');
var rekognition = new AWS.Rekognition();
var elasticsearch = require('elasticsearch');

exports.handler = async (event) => {
    var client = new elasticsearch.Client({
      host: 'addr',
      log: 'trace'
    });
    var objectToStore = {
        "objectKey": event.Records[0].s3.object.key,
        "bucket": event.Records[0].s3.bucket.name,
        "createdTimestamp": event.Records[0].eventTime,
        "labels": []
    };
    
    var params = {
      Image: {
       S3Object: {
        Bucket: event.Records[0].s3.bucket.name, 
        Name: event.Records[0].s3.object.key
       }
      }
     };
    await rekognition.detectLabels(params).promise()
    .then(data => {
        console.log('recognition', data)
        for (var label of data.Labels) {
            objectToStore.labels.push(label.Name);
        }
        
        return client.indices.exists({
            index: 'photos'
        })
        .then(data => {
            console.log('exists', data);
            if (data) {
                return client.index({
                  index: 'photos',
                  type: 'test',
                  refresh: true,
                  body: objectToStore 
                });
            } else {
                return client.create({
                  index: 'photos',
                  type: 'test',
                  body: objectToStore
                });
            }
        })
    })
    .then(data => {
        console.log("s", data);
    })
    .catch(error => {
        console.log("in err", error);
    });
    
};
