const { capitalise } = require('../utils/strUtils');

function generateAttribute(attr) {
  const { name, jsType, validator } = attr;

  return `
  @${validator}() readonly ${name}: ${jsType};
`;

}

module.exports = function(extractedModel) {

  const { name, attributes } = extractedModel;
  const attrStr = attributes.map(generateAttribute).join('');

  return `
import { IsString, IsInt, IsOptional, IsNumber, IsDate, IsBoolean } from 'class-validator';

export default class ${capitalise(name)}Dto {
${attrStr}
}
`;

}
