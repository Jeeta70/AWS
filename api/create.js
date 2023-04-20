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
  let data = JSON.parse(event.body);
  try {
    const params = {
      TableName: 'certificateTable',
      Item: {
        certificate_id: data.certificate_id,
        userEmail: data.userEmail,
        name: data.name,
        certificate_name: data.certificate_name,
        provider: data.provider,
        level: data.level,
        date: data.date,
        expiry_date: data.expiry_date,
        validity: data.validity,
        deleteFlag: data.deleteFlag,
      },
      ConditionalExpression: "attribute_already_exists(certificate_id)",
    };
    await documentClient.put(params).promise();
    callback(null, call.statement(201, data));  
  } catch (err) {
    callback(null, call.statement(500, err.message));
  }
};
