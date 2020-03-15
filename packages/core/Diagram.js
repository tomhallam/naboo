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

const DEFAULT_EDGE_ATTRS = {
  fontcolor: '#2D3436',
  fontname: 'Sans-Serif',
  fontsize: '11',
  color: '#666666',
};

const resources = {};

const httpLinkFn = (instance, source, dest, options) => {
  instance.addEdge(source, dest, {
    ...DEFAULT_EDGE_ATTRS,
    label: '',
    ...options
  });
};

const tcpLinkFn = (instance, source, dest, options) => {
  instance.addEdge(source, dest, {
    ...DEFAULT_EDGE_ATTRS,
    label: 'tcp',
    ...options
  });
};

const wsLinkFn = (instance, source, dest, options) => {
  instance.addEdge(source, dest, {
    ...DEFAULT_EDGE_ATTRS,
    label: 'websocket',
    ...options
  });
};

class Diagram {
  constructor(name) {
    this.graph = digraph(name);
    this.linkTypes = {};

    Object.entries(DEFAULT_GRAPH_ATTRIBUTES).forEach(([key, value]) =>
      this.graph.set(key, value)
    );

    this.registerLinkType('http', httpLinkFn);
    this.registerLinkType('tcp', tcpLinkFn);
    this.registerLinkType('websocket', wsLinkFn);
  }

  registerLinkType(type, fn) {
    if (!this.linkTypes[type]) {
      this.linkTypes[type] = fn;
    }
  }

  group(wrapperNode, groupCallback, parent) {
    const cluster = (parent || this.graph).addCluster(
      `cluster${wrapperNode.getLabel()}`
    );

    Object.entries({
      ...DEFAULT_GROUP_ATTRS,
      ...wrapperNode.getGroupAttrs()
    }).forEach(([key, value]) => cluster.set(key, value));

    cluster.set('label', wrapperNode.getLabel());

    groupCallback({
      group: (groupWrapperNode, groupGroupCallback) => {
        return this.group(groupWrapperNode, groupGroupCallback, cluster);
      },
      link: (type, source, dest, options) => {
        return this.link(type, source, dest, options, cluster);
      },
      add: (...instancesArray) => {
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

  link(type, source, dest, options = {}, parent) {
    const sourceNode = this.getNode(source);
    const destNode = this.getNode(dest);
    const linkFn = this.linkTypes[type];

    const instance = parent || this.graph;

    return linkFn(instance, sourceNode, destNode, options);
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
