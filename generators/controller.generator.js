const { capitalise } = require('../src/utils/strUtils');


module.exports = function(extractedModel) {

  const { name, attributes } = extractedModel;
  const capName = capitalise(name);

  return `
import { Get, Post, Body, Param, Controller, UsePipes  } from '@nestjs/common';
import { ${capName}Service } from './${name}.service';
import { ${capName} } from './${name}.entity';
import ${capName}Dto from './${name}.dto';
import { ValidationPipe } from '../common/validation.pipe';


@Controller('${name}')
export class ${capName}Controller {

  constructor(private readonly ${name}Service: ${capName}Service) {}

  @Get()
  async findAll(): Promise<${capName}[]> {
    return this.${name}Service.findAll();
  }

  @Get('/:id')
  async findById(@Param() params): Promise<${capName}> {
    return this.${name}Service.findById(parseInt(params.id));
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() ${name}: ${capName}Dto) {
    this.${name}Service.create(${name});
  }

  @Post('/:id')
  @UsePipes(new ValidationPipe())
  async update(@Param() id: number, @Body() ${name}: ${capName}Dto) {
    const this${capName} = await this.${name}Service.findById(id);
    this${capName}.set(${name});
    await this${capName}.save();
    return this${capName};
  }
}

`;

}
