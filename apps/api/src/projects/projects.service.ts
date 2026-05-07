import { Injectable, NotFoundException } from '@nestjs/common';
import { Project } from './interfaces/project.interface';

@Injectable()
export class ProjectsService {
  private readonly projects: Project[] = [];

  create(item: Project) {
    this.projects.push(item);
    return item;
  }

  findAll() {
    return this.projects;
  }

  findOne(id: string) {
    return this.projects.find((item) => item.id === id);
  }

  update(id: string, data: Partial<Project>) {
    const item = this.findOne(id);
    Object.assign(item, data);
    return item;
  }

  remove(id: string) {
    const index = this.projects.findIndex((item) => item.id === id);
    if (index === -1) throw new NotFoundException('Projeto não encontrado');
    this.projects.splice(index, 1);
  }
} 
