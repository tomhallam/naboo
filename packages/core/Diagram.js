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

const resources = {};

class Diagram {
  constructor(name) {
    this.graph = digraph(name);

    Object.entries(DEFAULT_GRAPH_ATTRIBUTES).forEach(([key, value]) =>
      this.graph.set(key, value)
    );
  }

  group(wrapperNode, groupCallback) {
    const cluster = this.graph.addCluster(wrapperNode.getLabel());


    Object.entries(wrapperNode.getGroupAttrs()).forEach(([key, value]) =>
      cluster.set(key, value)
    );

    groupCallback({
      link: (source, dest, options) => {
        const sourceNode = this.getNode(source);
        const destNode = this.getNode(dest);

        cluster.addEdge(sourceNode, destNode, {
          ...source.getEdgeAttrs(options),
          ...dest.getEdgeAttrs(options)
        });
        
        cluster.set('label', wrapperNode.getLabel());
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

  link(source, destination, options = {}) {
    const sourceId = source.getId();
    const destinationId = destination.getId();

    if (!resources[sourceId]) {
      resources[sourceId] = this.graph.addNode(sourceId, {
        label: source.getLabel(),
        ...source.getNodeAttrs()
      });
    }

    if (!resources[destinationId]) {
      resources[destinationId] = this.graph.addNode(destinationId, {
        label: destination.getLabel(),
        ...destination.getNodeAttrs()
      });
    }

    this.graph.addEdge(resources[sourceId], resources[destinationId], {
      ...source.getEdgeAttrs(options),
      ...destination.getEdgeAttrs(options)
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
