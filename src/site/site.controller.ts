
import { Get, Post, Body, Param, Controller, UsePipes  } from '@nestjs/common';
import { SiteService } from './site.service';
import { Site } from './site.entity';
import SiteDto from './site.dto';
import { ValidationPipe } from '../common/validation.pipe';


@Controller('site')
export class SiteController {

  constructor(private readonly siteService: SiteService) {}

  @Get()
  async findAll(): Promise<Site[]> {
    return this.siteService.findAll();
  }

  @Get('/:id')
  async findById(@Param() params): Promise<Site> {
    return this.siteService.findById(parseInt(params.id));
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
    thisSite.set(site);
    await thisSite.save();
    return thisSite;
  }
}

