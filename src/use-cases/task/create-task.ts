import { Task } from '@prisma/client'
import { TaskRepository } from '@/repositories/task-repository'
import { ProjectRepository } from '@/repositories/project-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

type CreateTaskUseCaseRequest = {
  name: string
  description?: string
  status: 'TODO' | 'DOING' | 'DONE'
  projectId: string
  userId: string
}

type CreateTaskUseCaseResponse = {
  task: Task
}

export class CreateTaskUseCase {
  constructor(
    private projectRepository: ProjectRepository,
    private taskRepository: TaskRepository
  ) {}

  async execute({
    name,
    description,
    status,
    projectId,
    userId,
  }: CreateTaskUseCaseRequest): Promise<CreateTaskUseCaseResponse> {
    const project = await this.projectRepository.findById(projectId)

    if (!project) {
      throw new ResourceNotFoundError()
    }

    if (project.user_id !== userId) {
      throw new InvalidCredentialsError()
    }

    const task = await this.taskRepository.create({
      name,
      status,
      description: description ?? null,
      project_id: projectId,
    })

    return {
      task,
    }
  }
}
