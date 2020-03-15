const { run } = require('@naboo/core/VM');
const { EC2 } = require('@naboo/resources/aws/compute');
const DynamoDBTable = require('@naboo/resources/aws/database/dynamodb/table');
const ELB = require('@naboo/resources/aws/networking/elb');

run(({ diagram, link }) => {
  const elb = new ELB('api.mycompany.com');
  const webServer = new EC2('Blog Application');
  const db = new DynamoDBTable('Posts');

  link('http', elb, webServer);
  link('http', webServer, db);

  return diagram;
});
