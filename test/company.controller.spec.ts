import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from '../src/company/company.controller';
import { CompanyModule } from '../src/company/company.module';
import { DatabaseModule } from '../src/db/database.module';
import { mockPost, mockGet } from './httpUtils';


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

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, CompanyModule],
    }).compile();
    companyController = app.get<CompanyController>(CompanyController);
  });

  describe('CRUD for company - make sure auth0 gets called', () => {

    it('creates a company - checks for user create', async () => {

    });

    it('gets all companies', async () => {

    });

  });
});
