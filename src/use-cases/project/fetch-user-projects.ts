import { Project } from '@prisma/client'
import { ProjectRepository } from '@/repositories/project-repository'

type FetchUserProjectsUseCaseRequest = {
  userId: string
}

type FetchUserProjectsUseCaseResponse = {
  projects: Project[]
}

export class FetchUserProjectsUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  async execute({
    userId,
  }: FetchUserProjectsUseCaseRequest): Promise<FetchUserProjectsUseCaseResponse> {
    const projects = await this.projectRepository.findManyByUserId(userId)

    return {
      projects,
    }
  }
}
