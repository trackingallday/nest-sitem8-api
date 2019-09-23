
import { Get, Post, Body, Param, Controller, UsePipes  } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Company } from './company.entity';
import CompanyDto from './company.dto';
import { ValidationPipe } from '../common/validation.pipe';


@Controller('company')
export class CompanyController {

  constructor(private readonly companyService: CompanyService) {}

  @Get()
  async findAll(): Promise<Company[]> {
    return this.companyService.findAll();
  }

  @Get('/:id')
  async findById(@Param() params): Promise<Company> {
    return this.companyService.findById(parseInt(params.id));
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() company: CompanyDto) {
    this.companyService.create(company);
  }

  @Post('/:id')
  @UsePipes(new ValidationPipe())
  async update(@Param() id: number, @Body() company: CompanyDto) {
    const thisCompany = await this.companyService.findById(id);
    thisCompany.set(company);
    await thisCompany.save();
    return thisCompany;
  }
}

