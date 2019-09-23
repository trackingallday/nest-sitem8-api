const { capitalise } = require('../utils/strUtils');

function generateAttribute(attr) {
  const { name, sqltype, text, jsType, sqlizeType } = attr;

  return `
  @Column(DataType.${sqlizeType})
  ${name}: ${jsType};
  `;

}

module.exports = function(extractedModel) {

  const { name, attributes } = extractedModel;
  const attrstr = attributes.map(generateAttribute).join('');
  return `
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class ${capitalise(name)} extends Model<${capitalise(name)}> {
${attrstr}
}

`;

}
