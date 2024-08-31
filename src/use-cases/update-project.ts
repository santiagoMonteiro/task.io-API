import { Project } from '@prisma/client'
import { ProjectRepository } from '@/repositories/project-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

type UpdateProjectUseCaseRequest = {
  id: string
  userId: string
  name?: string
  description?: string
  deliveryDate?: Date
}

type UpdateProjectUseCaseResponse = {
  project: Project
}

export class UpdateProjectUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  async execute({
    id,
    userId,
    deliveryDate,
    description,
    name,
  }: UpdateProjectUseCaseRequest): Promise<UpdateProjectUseCaseResponse> {
    const project = await this.projectRepository.findById(id)

    if (!project) {
      throw new ResourceNotFoundError()
    }

    if (project.user_id !== userId) {
      throw new InvalidCredentialsError()
    }

    const newProject = await this.projectRepository.update(id, {
      delivery_date: deliveryDate,
      description,
      name,
    })

    return {
      project: newProject!,
    }
  }
}
