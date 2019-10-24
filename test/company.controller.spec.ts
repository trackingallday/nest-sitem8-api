import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from '../src/company/company.controller';
import { CompanyModule } from '../src/company/company.module';
import { DatabaseModule } from '../src/db/database.module';
import { CreateCompanyDto } from '../src/company/createcompany.dto';
import { CompanyDto } from '../src/company/company.dto';
import { AccessTokenService } from '../src/accessToken/accessToken.service';
import { AccessTokenModule } from '../src/accessToken/accessToken.module';
import { mockPost, mockGet } from './utils/httpUtils';
import { CompanyInterface } from '../src/company/company.interface';


// To mock classes using typescript follow this pattern exactly or it breaks
let mockCreateUser = jest.fn();
mockCreateUser.mockReturnValue({ user_id: "authid" });
 //do not use an arrow function here
jest.mock('../src/common/auth0.gateway', function() {
  return {
    //that default is very important
    default: jest.fn().mockImplementation(() => {
      return { createUser: mockCreateUser };
    }),
  };
});

describe('tests the company controller', () => {

  let companyController: CompanyController;
  let accessTokenService: AccessTokenService;
  let company: CompanyInterface;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, AccessTokenModule, CompanyModule],
    }).compile();
    companyController = app.get<CompanyController>(CompanyController);
    accessTokenService = app.get<AccessTokenService>(AccessTokenService);
  });

  describe('CRUD for company - make sure auth0 gets called', () => {

    it('creates a company - checks for user create', async () => {
      const props : CreateCompanyDto = {
        companyName: 'test company',
        name: 'new admin man',
        email: 'new@admin.com',
        mobile: '+643254213542153',
      };
      const data:any = await companyController.createcompany(
        mockPost('/createcompany', props, { companyId: 1, isSuperAdministrator: true }), props);
      expect(data.company.id).toBeTruthy();
      expect(data.user.companyId).toBe(data.company.id);
      expect(mockCreateUser).toBeCalled();
      expect(data.user.email).toBe(props.email);
      expect(data.company.name).toBe(props.companyName);
      company = data.company;
    });

    it('gets all companies', async () => {
      const allCompanies = await companyController.getAllCompanies();
      expect(allCompanies.length).toBeGreaterThan(1);
      expect(allCompanies.find(c => c.id === company.id)).toBeTruthy();
    });

    it('updates the new company', async () => {
      const props : CompanyDto = { ...company, name: 'new company name' };
      const updatedCompany:any = await companyController.updateCompany(
        mockPost('/updatecompany', props, { companyId: props.id, isAdministrator: true }), props);
      expect(updatedCompany.name).toBe('new company name');
      expect(updatedCompany.id).toBe(company.id);
    });

    it('gets company by user', async () => {
      const userCompany = await companyController.getCompany(
        mockGet('/getcompany', { companyId: company.id, isEnabled: true }));
      expect(userCompany.id).toBe(company.id);
    });

    it('gets company name by user', async () => {
      const userCompanyName = await companyController.getCompanyName(
        mockGet('/companyname', { companyId: company.id, isEnabled: true }));
      expect(userCompanyName).toBe('new company name');
    });

    it('gets company by access token', async () => {
      //uses magic ids form the setup data
      const token = await accessTokenService.createAccessToken(3);
      const company = await companyController.getCompanyFromToken(mockGet(`company/${token}`), token);
      expect(company.id).toBe(1);
    });

  });
});
