
import { Get, Post, Body, Param, Controller, UsePipes  } from '@nestjs/common';
import { SiteAssignmentService } from './siteAssignment.service';
import { SiteAssignment } from './siteAssignment.entity';
import SiteAssignmentDto from './siteAssignment.dto';
import { ValidationPipe } from '../common/validation.pipe';


@Controller('siteAssignment')
export class SiteAssignmentController {

  constructor(private readonly siteAssignmentService: SiteAssignmentService) {}

  @Get()
  async findAll(): Promise<SiteAssignment[]> {
    return this.siteAssignmentService.findAll();
  }

  @Get('/:id')
  async findById(@Param() params): Promise<SiteAssignment> {
    return this.siteAssignmentService.findById(parseInt(params.id));
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() siteAssignment: SiteAssignmentDto) {
    this.siteAssignmentService.create(siteAssignment);
  }

  @Post('/:id')
  @UsePipes(new ValidationPipe())
  async update(@Param() id: number, @Body() siteAssignment: SiteAssignmentDto) {
    const thisSiteAssignment = await this.siteAssignmentService.findById(id);
    thisSiteAssignment.set(siteAssignment);
    await thisSiteAssignment.save();
    return thisSiteAssignment;
  }
}

