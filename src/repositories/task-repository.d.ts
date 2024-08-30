import { Task, Prisma } from '@prisma/client'

export interface TaskRepository {
  create(data: Prisma.TaskCreateInput): Promise<Task>
  findManyByProjectId(projectId: string): Promise<Task[]>
  update(id: string, data: Prisma.TaskUpdateInput)
  delete(id: string): Promise<void>
}