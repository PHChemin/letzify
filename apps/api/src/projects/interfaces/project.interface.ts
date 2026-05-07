export interface BrandProject {
  id: number;
  ownerId: string;
  name: string;
  slug: string;
  description?: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Type alias for Project to maintain the "global" module consistency.
 * Currently, a Project is always a BrandProject.
 */
export type Project = BrandProject;
