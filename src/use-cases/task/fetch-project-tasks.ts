import { Task } from '@prisma/client'
import { TaskRepository } from '@/repositories/task-repository'
import { ProjectRepository } from '@/repositories/project-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

type FetchProjectTasksUseCaseRequest = {
  userId: string
  projectId: string
}

type FetchProjectTasksUseCaseResponse = {
  tasks: Task[]
}

export class FetchProjectTasksUseCase {
  constructor(
    private projectRepository: ProjectRepository,
    private taskRepository: TaskRepository
  ) {}

  async execute({
    projectId,
    userId
  }: FetchProjectTasksUseCaseRequest): Promise<FetchProjectTasksUseCaseResponse> {
    const project = await this.projectRepository.findById(projectId)
    
    if (!project) {
      throw new ResourceNotFoundError()
    }

    if (project.user_id !== userId) {
      throw new InvalidCredentialsError()
    }

    const tasks = await this.taskRepository.findManyByProjectId(projectId)

    return {
      tasks,
    }
  }
}
