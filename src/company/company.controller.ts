
import { Get, Post, Body, Param, Controller, UsePipes, Req  } from '@nestjs/common';
import { CompanyService } from './company.service';
import { WorkerService } from '../worker/worker.service';
import { WorkerInterface } from '../worker/worker.interface';
import { AccessTokenService } from '../accessToken/accessToken.service';
import Auth0Gateway from '../common/auth0.gateway';
import { Company } from './company.entity';
import { CompanyInterface } from './company.interface';
import { CompanyDto } from './company.dto';
import { CreateCompanyDto } from './createcompany.dto';
import { ValidationPipe } from '../common/validation.pipe';
import { isError } from 'util';


@Controller('company')
export class CompanyController {

  constructor(private readonly companyService: CompanyService,
    private readonly workerService: WorkerService,
    private readonly accessTokenService: AccessTokenService,
    ) {}

  @Get()
  async findAll(): Promise<Company[]> {
    return this.companyService.findAll();
  }

  @Get('/:id')
  async findById(@Param() params): Promise<Company> {
    return this.companyService.findById(parseInt(params.id));
  }

  @Get('companyname')
  async getCompanyName(@Req() req): Promise<string> {
    const company: Company = await this.companyService.findById(req.dbUser.companyId);
    return company.name;
  }

  @Get('company/:token')
  async getCompanyFromToken(@Req() req, @Param() token:string) {
    const user = await this.accessTokenService.getWorkerFromAccessToken(token);
    const company = await this.companyService.findById(user.companyId);
    return company.toJSON();
  }

  @Post('updatecompany')
  @UsePipes(new ValidationPipe())
  async updateCompany(@Req() req, @Body() params: CompanyDto) {
    const company = await this.companyService.updateCompany(params);
    return company.toJSON();
  }

  @Post('createcompany')
  @UsePipes(new ValidationPipe())
  async createcompany(@Req() req, @Body() companyParams: CreateCompanyDto) {
    const company: Company = await this.companyService.addCompany(companyParams.companyName);
    const admin: WorkerInterface = {
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
    };
    const user = await this.workerService.create(admin);
    const authdata = await new Auth0Gateway().createUser(user.email);
    const authedUser = await this.workerService.updateOne(user.id,
      { ...user.toJSON(),  authId: authdata.user_id });
    return { user: authedUser.toJSON(), company: company.toJSON() };
  }

  @Get('getcompany')
  async getCompany(@Req() req): Promise<any> {
    const company = await this.companyService.findById(req.dbUser.companyId);
    return company.toJSON();
  }

  @Get('getallcompanies')
  async getAllCompanies(): Promise<any> {
    const companies = await this.companyService.findAll();
    return companies.map(c => c.toJSON());
  }

}
