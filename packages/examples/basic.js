const { run } = require('@naboo/core/VM');
const { EC2, Lambda } = require('@naboo/resources/aws/compute');
const SQS = require('@naboo/resources/aws/integration/sqs');
const DynamoDBTable = require('@naboo/resources/aws/database/dynamodb/table');
const ELB = require('@naboo/resources/aws/networking/elb');
const SNS = require('@naboo/resources/aws/integration/sns');

run(({ diagram }) => {
  const elb = new ELB('api.mycompany.com');
  const processingLambda = new Lambda('Batch Processing Lambda');
  const archiveLambda = new Lambda('Archive Lambda');
  const triggerLambda = new Lambda('Trigger Lambda');
  const messageQueue = new SQS('Messages Queue');
  const itemsTable = new DynamoDBTable('Saved Messages');
  const pushNotification = new SNS('Push Notification');

  const webServer = new EC2('Web Server');

  diagram.link('http', elb, webServer);

  diagram.link('http', webServer, messageQueue);

  diagram.link('http', messageQueue, processingLambda);
  diagram.link('http', messageQueue, archiveLambda);
  diagram.link('http', messageQueue, triggerLambda);

  diagram.link('http', archiveLambda, itemsTable, {
    dir: 'forward',
  });

  diagram.link('http', triggerLambda, pushNotification);

  return diagram;
});
