import { Project, User } from '@prisma/client'
import { ProjectRepository } from '@/repositories/project-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

type DeleteProjectUseCaseRequest = {
  id: string
  userId: string
}

type DeleteProjectUseCaseResponse = {
  project: Project
}

export class DeleteProjectUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  async execute({
    id,
    userId,
  }: DeleteProjectUseCaseRequest): Promise<DeleteProjectUseCaseResponse> {
    const project = await this.projectRepository.findById(id)

    if (!project) {
      throw new ResourceNotFoundError()
    }

    if (project.user_id !== userId) {
      throw new InvalidCredentialsError()
    }

    const deletedProject = await this.projectRepository.delete(id)

    return {
      project: deletedProject!,
    }
  }
}
