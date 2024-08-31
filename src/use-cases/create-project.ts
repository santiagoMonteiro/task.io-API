import { Project } from '@prisma/client'
import { ProjectRepository } from '@/repositories/project-repository'

type CreateProjectUseCaseRequest = {
  name: string
  description?: string
  deliveryDate: Date
  userId: string
}

type CreateProjectUseCaseResponse = {
  project: Project
}

export class CreateProjectUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  async execute({
    name,
    description,
    deliveryDate,
    userId,
  }: CreateProjectUseCaseRequest): Promise<CreateProjectUseCaseResponse> {
    const project = await this.projectRepository.create({
      name,
      delivery_date: deliveryDate,
      user_id: userId,
      description: description ?? null,
    })

    return {
      project,
    }
  }
}
