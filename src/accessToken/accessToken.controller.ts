
import { Get, Post, Body, Param, Controller, UsePipes  } from '@nestjs/common';
import { AccessTokenService } from './accessToken.service';
import { AccessToken } from './accessToken.entity';
import AccessTokenDto from './accessToken.dto';
import { ValidationPipe } from '../common/validation.pipe';


@Controller('accessToken')
export class AccessTokenController {

  constructor(private readonly accessTokenService: AccessTokenService) {}

  @Get()
  async findAll(): Promise<AccessToken[]> {
    return this.accessTokenService.findAll();
  }

  @Get('/:id')
  async findById(@Param() params): Promise<AccessToken> {
    return this.accessTokenService.findById(parseInt(params.id));
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() accessToken: AccessTokenDto) {
    this.accessTokenService.create(accessToken);
  }

  @Post('/:id')
  @UsePipes(new ValidationPipe())
  async update(@Param() id: number, @Body() accessToken: AccessTokenDto) {
    const thisAccessToken = await this.accessTokenService.findById(id);
    thisAccessToken.set(accessToken);
    await thisAccessToken.save();
    return thisAccessToken;
  }
}

