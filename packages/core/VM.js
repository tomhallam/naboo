const Diagram = require('./Diagram');

function run(fn) {
  const rootDiagram = new Diagram('Architecture');
  const result = fn({ diagram: rootDiagram });

  console.log(result.graph.to_dot());
  result.graph.output('png', 'output.png');
}

module.exports = {
  run
};
