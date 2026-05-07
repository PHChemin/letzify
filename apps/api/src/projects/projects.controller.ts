import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Delete,
    HttpCode,
    Query,
} from '@nestjs/common';
import { ParseIdPipe } from '../common/pipes/parse-id.pipe';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { QueryFilterDto } from './dto/query-filter.dto';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }

    @Post()
    @HttpCode(201)
    create(@Body() dto: CreateProjectDto) {
        return this.projectsService.create(dto);
    }

    @Get()
    findAll(@Query() query: QueryFilterDto) {
        return this.projectsService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIdPipe) id: number) {
        return this.projectsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIdPipe) id: number, @Body() dto: Partial<CreateProjectDto>) {
        return this.projectsService.update(id, dto);
    }

    @Delete(':id')
    @HttpCode(204)
    remove(@Param('id', ParseIdPipe) id: number) {
        this.projectsService.remove(id);
    }
}
