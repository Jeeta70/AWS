var DynamoDB = require("aws-sdk/clients/dynamodb");
const call = require("./call");
var documentClient = new DynamoDB.DocumentClient({
  region: "ap-south-1",
  maxRetries: 3,
  httpOptions: {
    timeout: 5000,
  },
});

const CERTIFICATE_TABLE_NAME = process.env.CERTIFICATE_TABLE_NAME;

module.exports.certificate = async (event, context, callback) => {
  let deleteFlag = event["queryStringParameters"]["deleteFlag"];
  try {
    const params = {
      TableName: CERTIFICATE_TABLE_NAME || "certificateTable",
      FilterExpression: "deleteFlag = :deleteFlag",
      ExpressionAttributeValues: { ":deleteFlag": deleteFlag },
      ConditionalExpression: "attribute_already_exists(certificate_id)",
    };
    let data = await documentClient.scan(params).promise();
    callback(null, call.statement(201, data));
  } catch (err) {
    callback(null, call.statement(500, err.message));
  }
};
