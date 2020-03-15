const { run } = require('@naboo/core/VM');
const { EC2, Lambda } = require('@naboo/resources/aws/compute');
const SQS = require('@naboo/resources/aws/integration/sqs');
const VPC = require('@naboo/resources/aws/networking/vpc');

run(({ diagram }) => {
  diagram.group(new VPC(), group => {
    const webServer = new EC2('Web Server');
    const messageQueue = new SQS('Messages Queue');
    const processingLambda = new Lambda('Batch Processing Lambda');

    group.link(webServer, messageQueue);
    group.link(messageQueue, processingLambda);

    group.add([webServer, messageQueue, processingLambda]);
  });

  return diagram;
});
