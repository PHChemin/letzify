import { Controller, Post, Body, Get, Param, Put, Delete, HttpCode } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from './interfaces/project.interface';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }

    @Post()
    @HttpCode(201)
    create(@Body() item: Project) {
        return this.projectsService.create(item);
    }

    @Get()
    findAll() {
        return this.projectsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.projectsService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() data: Partial<Project>) {
        return this.projectsService.update(id, data);
    }

    @Delete(':id')
    @HttpCode(204)
    remove(@Param('id') id: string) {
        this.projectsService.remove(id);
    }
}
