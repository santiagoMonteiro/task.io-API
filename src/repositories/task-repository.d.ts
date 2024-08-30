import { Task, Prisma } from '@prisma/client'

export type TaskCreateInput = Omit<Task, 'id' | 'created_at'>
export type TaskUpdateInput = Omit<Task, 'id' | 'created_at'>

export interface TaskRepository {
  create(data: TaskCreateInput): Promise<Task>
  findManyByProjectId(projectId: string): Promise<Task[]>
  update(id: string, data: TaskUpdateInput)
  delete(id: string): Promise<Task | null>
}
