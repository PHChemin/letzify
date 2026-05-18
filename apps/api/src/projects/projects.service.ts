import { Injectable, NotFoundException } from '@nestjs/common';
import { Project } from './interfaces/project.interface';
import { CreateProjectDto } from './dto/create-project.dto';
import { QueryFilterDto } from './dto/query-filter.dto';
import { ProjectAlreadyExistsException } from './exceptions/project-already-exists.exception';

@Injectable()
export class ProjectsService {
  private readonly projects: Project[] = [];

  create(dto: CreateProjectDto) {
    const slug = this.generateSlug(dto.name);
    const slugExists = this.projects.some((p) => p.slug === slug);
    if (slugExists) {
      throw new ProjectAlreadyExistsException(dto.name);
    }

    const newProject: Project = {
      id: this.projects.length + 1,
      ...dto,
      slug,
      ownerId: 'temp-owner-id',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.projects.push(newProject);
    return newProject;
  }

  findAll(query: QueryFilterDto) {
    let results = [...this.projects];

    if (query.filter) {
      const filter = query.filter.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(filter) ||
          p.description?.toLowerCase().includes(filter),
      );
    }

    const limit = 10;
    const page = query.page || 1;
    const start = (page - 1) * limit;

    return results.slice(start, start + limit);
  }

  findOne(id: number) {
    const project = this.projects.find((item) => item.id === id);
    if (!project) throw new NotFoundException('Projeto não encontrado');
    return project;
  }

  update(id: number, data: Partial<CreateProjectDto>) {
    const item = this.findOne(id);

    if (data.name) {
      const slug = this.generateSlug(data.name);
      const slugExists = this.projects.some((p) => p.slug === slug && p.id !== id);
      if (slugExists) {
        throw new ProjectAlreadyExistsException(data.name);
      }
      item.slug = slug;
    }

    Object.assign(item, { ...data, updatedAt: new Date() });
    return item;
  }

  remove(id: number) {
    const index = this.projects.findIndex((item) => item.id === id);
    if (index === -1) throw new NotFoundException('Projeto não encontrado');
    this.projects.splice(index, 1);
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

