const { capitalise } = require('../utils/strUtils');

module.exports = function(extractedModel) {

  const { name } = extractedModel;
  const capName = capitalise(name);
  return `
import { Module } from '@nestjs/common';
import { ${capName}Controller } from './${name}.controller';
import { ${capName}Service } from './${name}.service';
import { ${capName}Provider } from './${name}.provider';
import { DatabaseModule } from '../db/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [${capName}Controller],
  providers: [
    ${capName}Service,
    ...${capName}Provider,
  ],
})
export class ${capName}Module {}
`;

}
