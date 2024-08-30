import { Project, Prisma } from '@prisma/client'

export type ProjectCreateInput = Omit<Project, 'id' | 'created_at'>
export type ProjectUpdateInput = Omit<Project, 'id' | 'created_at'>

export interface ProjectRepository {
  create(data: ProjectCreateInput): Promise<Project>
  findById(id: string): Promise<Project | null>
  findManyByUserId(userId: string): Promise<Project[]>
  update(id: string, data: ProjectUpdateInput)
  delete(id: string): Promise<Project | null>
}
