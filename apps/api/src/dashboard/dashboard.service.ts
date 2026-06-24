import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(ownerId: string) {
    const projectWhere = { ownerId };

    const [
      totalProjects,
      totalPalettes,
      totalAssets,
      totalTypographies,
      recentProjects,
    ] = await Promise.all([
      this.prisma.brandProject.count({ where: projectWhere }),
      this.prisma.colorPalette.count({
        where: { project: { ownerId } },
      }),
      this.prisma.visualAsset.count({
        where: { project: { ownerId } },
      }),
      this.prisma.typography.count({
        where: { project: { ownerId } },
      }),
      this.prisma.brandProject.findMany({
        where: projectWhere,
        orderBy: { updatedAt: 'desc' },
        take: 5,
      }),
    ]);

    return {
      totalProjects,
      totalPalettes,
      totalAssets,
      totalTypographies,
      recentProjects,
    };
  }
}
