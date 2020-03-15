const { run } = require('@naboo/core/VM');
const { EC2, Lambda } = require('@naboo/resources/aws/compute');
const SQS = require('@naboo/resources/aws/integration/sqs');
const VPC = require('@naboo/resources/aws/networking/vpc');
const ELB = require('@naboo/resources/aws/networking/elb');

run(({ diagram }) => {
  const elb = new ELB('api.mycompany.com');
  const processingLambda = new Lambda('Batch Processing Lambda');
  const messageQueue = new SQS('Messages Queue');

  diagram.group(new VPC('VPC1'), vpc => {
    const webServer = new EC2('Web Server');

    vpc.link(webServer, messageQueue, {
      label: 'Each request turned to message'
    });

    vpc.link(messageQueue, processingLambda);

    diagram.link(elb, webServer);
  });

  return diagram;
});
