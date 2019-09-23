
import { Injectable, Inject } from '@nestjs/common';
import { AccessToken } from './accessToken.entity';
import { AccessTokenInterface } from './accessToken.interface';
import constants from '../constants'

@Injectable()
export class AccessTokenService {

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

}

