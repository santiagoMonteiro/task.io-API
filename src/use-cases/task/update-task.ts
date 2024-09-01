import { Task } from '@prisma/client'
import { TaskRepository } from '@/repositories/task-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { ProjectRepository } from '@/repositories/project-repository'

type UpdateTaskUseCaseRequest = {
  id: string
  userId: string
  name?: string
  description?: string
  status?: 'TODO' | 'DOING' | 'DONE'
}

type UpdateTaskUseCaseResponse = {
  task: Task
}

export class UpdateTaskUseCase {
  constructor(
    private projectRepository: ProjectRepository,
    private taskRepository: TaskRepository
  ) {}

  async execute({
    id,
    userId,
    name,
    description,
    status,
  }: UpdateTaskUseCaseRequest): Promise<UpdateTaskUseCaseResponse> {
    const task = await this.taskRepository.findById(id)

    if (!task) {
      throw new ResourceNotFoundError()
    }

    const project = await this.projectRepository.findById(task.project_id)

    if (project!.user_id !== userId) {
      throw new InvalidCredentialsError()
    }

    const newTask = await this.taskRepository.update(id, {
      description,
      name,
      status,
    })

    return {
      task: newTask!,
    }
  }
}
