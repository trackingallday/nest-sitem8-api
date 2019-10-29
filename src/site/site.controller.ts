
import { Get, Post, Body, Param, Controller, UsePipes, Req  } from '@nestjs/common';
import { SiteService } from './site.service';
import { Site } from './site.entity';
import SiteDto from './site.dto';
import { ValidationPipe } from '../common/validation.pipe';


@Controller('sites')
export class SiteController {

  constructor(private readonly siteService: SiteService) {}

  @Get('/sites')
  async findById(@Req() req:any): Promise<Site[]> {
    return await this.siteService.findAllWhere({
      where: {
        companyId: req.dbUser.companyId,
      }
    });
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() site: SiteDto) {
    this.siteService.create(site);
  }

  @Post('/:id')
  @UsePipes(new ValidationPipe())
  async update(@Param() id: number, @Body() site: SiteDto) {
    const thisSite = await this.siteService.findById(id);
    await thisSite.update(site);
    return thisSite;
  }
}

