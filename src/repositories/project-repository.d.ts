import { Project, Prisma } from '@prisma/client'

export interface ProjectRepository {
  create(data: Prisma.ProjectCreateInput): Promise<Project>
  findById(id: string): Promise<Project | null>
  findManyByUserId(userId: string): Promise<Project[]>
  update(id: string, data: Prisma.ProjectUpdateInput)
  delete(id: string): Promise<void>
}