const { digraph } = require('graphviz');

const DEFAULT_GRAPH_ATTRIBUTES = {
  pad: '2.0',
  splines: 'ortho',
  nodesep: '0.60',
  ranksep: '0.75',
  fontname: 'Sans-Serif',
  fontsize: '15',
  fontcolor: '#2D3436',
  rankdir: 'LR'
};

const DEFAULT_GROUP_ATTRS = {
  style: 'rounded',
  labeljust: 'l',
  pencolor: '#AEB6BE',
  fontname: 'Sans-Serif',
  fontsize: '12'
};

const resources = {};

class Diagram {
  constructor(name) {
    this.graph = digraph(name);

    Object.entries(DEFAULT_GRAPH_ATTRIBUTES).forEach(([key, value]) =>
      this.graph.set(key, value)
    );
  }

  group(wrapperNode, groupCallback) {
    const cluster = this.graph.addCluster(`cluster${wrapperNode.getLabel()}`);

    Object.entries({
      ...DEFAULT_GROUP_ATTRS,
      ...wrapperNode.getGroupAttrs()
    }).forEach(([key, value]) => cluster.set(key, value));

    cluster.set('label', wrapperNode.getLabel());

    groupCallback({
      link: (source, dest, options) => {
        return this.link(source, dest, options, cluster);
      },
      add: instancesArray => {
        instancesArray.forEach(instance => {
          if (!resources[instance.getId()]) {
            resources[instance.getId()] = cluster.addNode(instance.getId(), {
              label: instance.getLabel(),
              ...instance.getNodeAttrs()
            });
          }
        });
      }
    });
  }

  getNode(instance) {
    const instanceId = instance.getId();

    if (!resources[instanceId]) {
      resources[instanceId] = this.graph.addNode(instanceId, {
        label: instance.getLabel(),
        ...instance.getNodeAttrs()
      });
    }

    return resources[instanceId];
  }

  link(source, dest, options = {}, parent) {
    const sourceNode = this.getNode(source);
    const destNode = this.getNode(dest);

    (parent || this.graph).addEdge(sourceNode, destNode, {
      ...source.getEdgeAttrs(options),
      ...dest.getEdgeAttrs(options)
    });
  }

  toDot() {
    return this.graph.to_dot();
  }

  toPNG() {
    console.log('Writing graph...');
    return this.graph.output('png', 'output.png', (...args) => {
      console.error('error', args);
    });
  }
}

module.exports = Diagram;
