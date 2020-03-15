const uuid = require('uuid');

const DEFAULT_ATTRIBUTES = {
  shape: 'none',
  fixedsize: 'true',
  width: '1.4',
  height: 1.9,
  labelloc: 'b',
  imagescale: 'true',
  fontname: 'Sans-Serif',
  fontsize: '13',
  fontcolor: '#2D3436'
};

class Resource {
  constructor(label) {
    this.label = label;
  }

  getId() {
    if (!this.id) {
      this.id = uuid.v4();
    }

    return this.id;
  }

  getLabel() {
    return this.label;
  }

  getNodeAttrs() {
    return {
      ...DEFAULT_ATTRIBUTES
    };
  }

  getEdgeAttrs() {
    return {};
  }
}

module.exports = {
  DEFAULT_ATTRIBUTES,
  Resource
};
