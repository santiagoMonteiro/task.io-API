import { Project } from '@prisma/client'
import { ProjectRepository } from '@/repositories/project-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

type GetProjectUseCaseRequest = {
  id: string
  userId: string
}

type GetProjectUseCaseResponse = {
  project: Project
}

export class GetProjectUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  async execute({
    id,
    userId,
  }: GetProjectUseCaseRequest): Promise<GetProjectUseCaseResponse> {
    const project = await this.projectRepository.findById(id)

    if (!project) {
      throw new ResourceNotFoundError()
    }

    if (project.user_id !== userId) {
      throw new InvalidCredentialsError()
    }

    return {
      project,
    }
  }
}
