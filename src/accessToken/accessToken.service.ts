
import { Injectable, Inject } from '@nestjs/common';
import { AccessToken } from './accessToken.entity';
import { AccessTokenInterface } from './accessToken.interface';
import { createPassword } from '../common/global';
import { Sequelize } from 'sequelize-typescript';
import moment from '../../node_modules/moment/src/moment';
import { WorkerService } from '../worker/worker.service';
import { ACCESSTOKENCONSTANTS } from './constants';

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
    accessToken.creationDateTime = new moment(new Date()).utc();
    accessToken.workerId = workerId;
    accessToken.accessTokenId = await createPassword(10);
    // Add to database.
    await this.create(accessToken);
    return accessToken.accessTokenId;
  }

  // accesstokenmanager - GetAccessToken
  async checkAccessToken(ret: AccessToken, accessTokenId: string): Promise<AccessToken> {
    // Check to see if the token is expired.
    if (ret != null && ret.creationDateTime < moment(new Date()).utc().subtract(ACCESSTOKENCONSTANTS.accessTokenExpiryDays, 'd')) {
      // todo:
      // logger.Warn('Access to token ' + accessTokenId.substring(0, 3) + '... was rejected due to exceeding the access token period');
      return null;
    }

    if (ret == null) {
      // Record the date/time for every 100th failure.
      if (ACCESSTOKENCONSTANTS.FAILURECOUNT++ >= ACCESSTOKENCONSTANTS.FAILURECOUNTLIMIT) {
        // todo:
        // logger.Error('Access token lockout was enabled.');
        ACCESSTOKENCONSTANTS.FAILURECOUNT = 0;
        ACCESSTOKENCONSTANTS.FAILUREDATETIME = new moment(new Date()).utc();
      }
    } else if ((moment(new Date()).utc().subtract(ACCESSTOKENCONSTANTS.FAILUREDATETIME, 'd')).get < ACCESSTOKENCONSTANTS.FAILURESECONDSLIMIT) {
      // todo:
      // logger.Error('Access token lockout was used to reject a valid access token.');
      ret = null;
    }

    return ret;
  }

  async getWorkerFromAccessToken(accessTokenId: string): Promise<any> {
    const at: AccessToken = await this.getAccessToken(accessTokenId);
    const accessToken: AccessToken = await this.checkAccessToken(at, accessTokenId);
    if (accessToken == null) {
      return null;
    }
    return await this.workerService.findById(accessToken.workerId);
  }

}
