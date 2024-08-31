import { Task } from '@prisma/client'
import { TaskRepository } from '@/repositories/task-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { ProjectRepository } from '@/repositories/project-repository'

type DeleteTaskUseCaseRequest = {
  id: string
  userId: string
}

type DeleteTaskUseCaseResponse = {
  task: Task
}

export class DeleteTaskUseCase {
  constructor(
    private projectRepository: ProjectRepository,
    private taskRepository: TaskRepository
  ) {}

  async execute({
    id,
    userId,
  }: DeleteTaskUseCaseRequest): Promise<DeleteTaskUseCaseResponse> {
    const task = await this.taskRepository.findById(id)

    if (!task) {
      throw new ResourceNotFoundError()
    }

    const project = await this.projectRepository.findById(task.project_id)

    if (project!.user_id !== userId) {
      throw new InvalidCredentialsError()
    }

    const deletedTask = await this.taskRepository.delete(id)

    return {
      task: deletedTask!,
    }
  }
}
