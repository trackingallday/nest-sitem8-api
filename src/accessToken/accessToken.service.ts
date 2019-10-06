
import { Injectable, Inject } from '@nestjs/common';
import { AccessToken } from './accessToken.entity';
import { AccessTokenInterface } from './accessToken.interface';
import { createPassword } from '../common/global';
import { Sequelize } from 'sequelize-typescript';
import * as moment from 'moment';
import { WorkerService } from '../worker/worker.service';
import { ACCESSTOKENCONSTANTS } from './constants';

const {
  FAILURECOUNT,
  FAILURECOUNTLIMIT,
  FAILUREDATETIME,
  FAILURESECONDSLIMIT,
  accessTokenExpiryDays,
} = ACCESSTOKENCONSTANTS;

@Injectable()
export class AccessTokenService {

  constructor(private readonly workerService: WorkerService ) {}

  @Inject('ACCESSTOKEN_REPOSITORY') private readonly ACCESSTOKEN_REPOSITORY: typeof AccessToken;

  async findAll(): Promise<AccessToken[]> {
    return await this.ACCESSTOKEN_REPOSITORY.findAll<AccessToken>();
  }

  async create(props: AccessTokenInterface): Promise<AccessToken> {
    return await this.ACCESSTOKEN_REPOSITORY.create<AccessToken>(props);
  }

  async findAllWhere(props): Promise<AccessToken[]> {
    return await this.ACCESSTOKEN_REPOSITORY.findAll<AccessToken>(props);
  }

  async findOneWhere(props): Promise<AccessToken> {
    return await this.ACCESSTOKEN_REPOSITORY.findOne<AccessToken>(props);
  }

  async findById(id): Promise<AccessToken> {
    return await this.ACCESSTOKEN_REPOSITORY.findByPk<AccessToken>(id);
  }

  async getAccessToken(accessTokenId: string): Promise<AccessToken> {
    return await this.ACCESSTOKEN_REPOSITORY.findOne<AccessToken>({
      where: Sequelize.where(
        Sequelize.fn('lower', Sequelize.col('accessTokenId')),
        Sequelize.fn('lower', accessTokenId),
    ) });
  }

  async createAccessToken(workerId: number): Promise<string> {
    const accessToken: AccessToken = new AccessToken();
    accessToken.creationDateTime = moment().utc().toDate();
    accessToken.workerId = workerId;
    accessToken.accessTokenId = await createPassword(10);
    // Add to database.
    await this.create(accessToken);
    return accessToken.accessTokenId;
  }

  // accesstokenmanager - GetAccessToken
  async checkAccessToken(ret: AccessToken): Promise<boolean> {
    // Check to see if the token is expired.
    return !!(ret && moment(ret.creationDateTime).isAfter(moment().utc().subtract(accessTokenExpiryDays, 'd')));
  }

  async getWorkerFromAccessToken(accessTokenId: string): Promise<any> {
    const at: AccessToken = await this.getAccessToken(accessTokenId);
    if (this.checkAccessToken(at)) {
      return await this.workerService.findById(at.workerId);
    }
    return null;
  }

}
