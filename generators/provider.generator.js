const { capitalise } = require('../src/utils/strUtils');

module.exports = function(extractedModel) {

  const { name } = extractedModel;

  return `
import { ${capitalise(name)} } from './${name}.entity';


export const ${capitalise(name)}Provider = [
  {
    provide: '${name.toUpperCase()}_REPOSITORY',
    useValue: ${capitalise(name)},
  },
];

`;

}
