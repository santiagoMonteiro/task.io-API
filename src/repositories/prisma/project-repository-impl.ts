import { prisma } from '@/lib/prisma'
import {
  ProjectCreateInput,
  ProjectRepository,
  ProjectUpdateInput,
} from '../project-repository'

export class ProjectRepositoryImpl implements ProjectRepository {
  async create(data: ProjectCreateInput) {
    const project = await prisma.project.create({
      data,
    })

    return project
  }

  async findById(id: string) {
    const project = await prisma.project.findUnique({
      where: {
        id,
      },
    })

    return project
  }

  async findManyByUserId(userId: string) {
    const projects = await prisma.project.findMany({
      where: {
        user_id: userId,
      },
    })

    return projects
  }

  async update(id: string, data: ProjectUpdateInput) {
    const project = await prisma.project.update({
      where: {
        id,
      },
      data,
    })

    return project
  }

  async delete(id: string) {
    const project = await prisma.project.delete({
      where: {
        id,
      },
    })

    return project
  }
}
