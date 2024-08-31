import { Task } from '@prisma/client'
import { TaskRepository } from '@/repositories/task-repository'

type CreateTaskUseCaseRequest = {
  name: string
  description?: string
  status: 'TODO' | 'DOING' | 'DONE'
  project_id: string
}

type CreateTaskUseCaseResponse = {
  task: Task
}

export class CreateTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute({
    name,
    description,
    status,
    project_id,
  }: CreateTaskUseCaseRequest): Promise<CreateTaskUseCaseResponse> {
    const task = await this.taskRepository.create({
      name,
      status,
      project_id,
      description: description ?? null,
    })

    return {
      task,
    }
  }
}
