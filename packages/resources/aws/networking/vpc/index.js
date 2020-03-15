const path = require('path');
const { Resource, DEFAULT_ATTRIBUTES } = require('@naboo/core/Resource');

class VPC extends Resource {
  constructor(label) {
    super(label);
    this.label = label || 'VPC';
  }

  getGroupAttrs() {
    return {
      style: 'filled',
      color: 'lightgrey'
    }
  }

  getNodeAttrs() {
    return {
      ...DEFAULT_ATTRIBUTES,
      image: path.resolve(__dirname, './icon.png')
    };
  }
}

module.exports = VPC;
