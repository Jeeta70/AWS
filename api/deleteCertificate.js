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
  let Id = event.pathParameters.certificate_id;
  try {
    const params = {
      TableName: CERTIFICATE_TABLE_NAME || "certificateTable",
      Key: {
        "certificate_id": Id,
      },
      ConditionalExpression: "attribute_exists(certificate_id)",
    };
    let data = await documentClient.delete(params).promise();
    callback(null, call.statement(201, data));
  } catch (err) {
    callback(null, call.statement(500, err.message));
  }
};
