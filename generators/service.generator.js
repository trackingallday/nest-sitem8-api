const { capitalise } = require('../src/utils/strUtils');


module.exports = function(extractedModel) {

  const { name, attributes } = extractedModel;
  const capName = capitalise(name);

  return `
import { Injectable, Inject } from '@nestjs/common';
import { ${capName} } from './${name}.entity';
import { ${capName}Interface } from './${name}.interface';
import constants from '../constants'

@Injectable()
export class ${capName}Service {

  @Inject('${name.toUpperCase()}_REPOSITORY') private readonly ${name.toUpperCase()}_REPOSITORY: typeof ${capName};

  async findAll(): Promise<${capName}[]> {
    return await this.${name.toUpperCase()}_REPOSITORY.findAll<${capName}>();
  }

  async create(props: ${capName}Interface): Promise<${capName}> {
    return await this.${name.toUpperCase()}_REPOSITORY.create<${capName}>(props);
  }

  async findAllWhere(props): Promise<${capName}[]> {
    return await this.${name.toUpperCase()}_REPOSITORY.findAll<${capName}>(props);
  }

  async findOneWhere(props): Promise<${capName}> {
    return await this.${name.toUpperCase()}_REPOSITORY.findOne<${capName}>(props);
  }

  async findById(id): Promise<${capName}> {
    return await this.${name.toUpperCase()}_REPOSITORY.findByPk<${capName}>(id);
  }

}

`;

}
