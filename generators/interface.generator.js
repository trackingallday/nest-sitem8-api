const { capitalise } = require('../src/utils/strUtils');

function generateAttribute(attr) {
  const { name, sqltype, text, jsType, sqlizeType } = attr;

  return `
  readonly ${name}: ${jsType};`;

}

module.exports = function(extractedModel) {
  const { name, attributes } = extractedModel;
  const attrsr = attributes.map(generateAttribute).join('');
  return `
export class ${capitalise(name)}Interface {${attrsr}
}
  `;

}
