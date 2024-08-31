import { Task, Prisma } from '@prisma/client'

export type TaskCreateInput = Omit<Task, 'id' | 'created_at'>

export type TaskUpdateInput = Omit<Partial<Task>, 'id' | 'created_at'>

export interface TaskRepository {
  create(data: TaskCreateInput): Promise<Task>
  findManyByProjectId(projectId: string): Promise<Task[]>
  findById(id: string): Promise<Task | null>
  update(
    id: string,
    data: TaskUpdateInput
  ): Promise<Task | null>
  delete(id: string): Promise<Task | null>
}
