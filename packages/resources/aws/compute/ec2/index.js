const path = require('path');
const { Resource, DEFAULT_ATTRIBUTES } = require('@naboo/core/Resource');

class EC2 extends Resource {
  constructor(label, options) {
    super(label);
    this.label = label;
    this.options = options;
  }

  getNodeAttrs() {
    return {
      ...DEFAULT_ATTRIBUTES,
      image: path.resolve(__dirname, './icon.png')
    };
  }
}

module.exports = EC2;
