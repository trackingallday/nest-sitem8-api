
import { Get, Post, Body, Param, Controller, UsePipes, Req  } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Company } from './company.entity';
import CompanyDto from './company.dto';
import { CreateCompanyDto } from './createcompany.dto';
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

  @Get('companyname')
  async GetCompanyName(@Req() req): Promise<string> {
    const company: Company = await this.companyService.findById( req.dbUser.companyId);
    return company.name;
  }

  // Todo
  // [Route("company/{token}")]
  // [HttpGet]
  // [AllowAnonymous]
  // public ContentResult GetCompany(string token)
  // {
  //     var worker = AccessTokenManager.GetWorkerFromAccessToken(token);
  //     return ToJSON(new CompanyManager(worker).GetCompany());
  // }

  @Post('updatecompany')
  @UsePipes(new ValidationPipe())
  async updateCompany(@Req() req, @Body() company: Company) {
    company.companyId = req.dbUser.companyId;
    await this.companyService.updateCompany(company);
    return true;
  }

  @Post('createcompany')
  @UsePipes(new ValidationPipe())
  async createcompany( @Body() companyParams: CreateCompanyDto) {
    const company: Company = await this.companyService.addCompany(companyParams.name);

    // TODO:
    // WorkerManager wm = new WorkerManager(user);
    // Worker newCompanyAdmin = new Worker();
    // newCompanyAdmin.Mobile = companyParams.mobile;
    // newCompanyAdmin.Name = companyParams.name;
    // newCompanyAdmin.Email = companyParams.email;
    // newCompanyAdmin.CompanyId = c.CompanyId;
    // wm.AddCompanyAdministrator(newCompanyAdmin);

    return 'Success';
  }

  @Get('getcompany')
  async getCompany(@Req() req): Promise<Company> {
    return await this.companyService.getCompanyByWorkerId(req.dbUser.companyId);
  }

  @Get('getallcompanies')
  async getAllCompanies(): Promise<Company[]> {
    return await this.companyService.findAll();
  }

  @Get('switchcompany/:id')
  @UsePipes(new ValidationPipe())
  async switchCompany(@Param() id: number) {
    // todo:
    // await this.workerService.switchCompany(LoggedInWorkerId(), id);
    return true;
  }

}
