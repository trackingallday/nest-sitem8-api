
import { Get, Post, Body, Param, Controller, UsePipes, Req  } from '@nestjs/common';
import { CompanyService } from './company.service';
import { WorkerService } from '../worker/worker.service';
import { WorkerInterface } from '../worker/worker.interface';
import { Company } from './company.entity';
import CompanyDto from './company.dto';
import { CreateCompanyDto } from './createcompany.dto';
import { ValidationPipe } from '../common/validation.pipe';


@Controller('company')
export class CompanyController {

  constructor(private readonly companyService: CompanyService,
    private readonly workerService: WorkerService) {}

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
    const company: Company = await this.companyService.findById(req.dbUser.companyId);
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
  async createcompany(@Body() companyParams: CreateCompanyDto) {
    const company: Company = await this.companyService.addCompany(companyParams.name);
    const worker: WorkerInterface = {
      companyId: company.id,
      name:  companyParams.name,
      mobile: companyParams.mobile,
      email: companyParams.email,
      payrollId: '0',
      supervisor: null,
      mobileNotifications: true,
      emailNotifications: true,
      isEnabled: true,
      isWorker: false,
      isSuperAdministrator: true,
      isSupervisor: false,
      isAdministrator: true,
      deviceId: null,
      base64Image: null,
      authId: null,
    }
    await this.workerService.create(worker);
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
