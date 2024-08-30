import { Prisma, Project } from '@prisma/client'
import {
  ProjectCreateInput,
  ProjectRepository,
  ProjectUpdateInput,
} from '../project-repository'
import { randomUUID } from 'crypto'

export class InMemoryProjectRepository implements ProjectRepository {
  private items: Project[] = []

  async create(data: ProjectCreateInput) {
    const project: Project = {
      id: randomUUID(),
      name: data.name,
      created_at: new Date(),
      delivery_date: data.delivery_date,
      description: data.description,
      user_id: data.user_id,
    }

    this.items.push(project)

    return project
  }

  async findById(id: string) {
    const project = this.items.find((item) => item.id === id)

    if (!project) {
      return null
    }
    return project
  }

  async findManyByUserId(userId: string) {
    const projects = this.items.filter((item) => item.id === userId)

    return projects
  }

  async update(id: string, data: ProjectUpdateInput) {
    const projectIndex = this.items.findIndex((item) => item.id === id)

    if (projectIndex === -1) {
      return null
    }

    const updatedProject: Project = {
      ...this.items[projectIndex],
      ...data,
    }

    this.items[projectIndex] = updatedProject

    return updatedProject
  }

  async delete(id: string) {
    const projectIndex = this.items.findIndex((item) => item.id === id)
    const project = this.items[projectIndex]

    if (projectIndex === -1) {
      return null
    }

    this.items.splice(projectIndex, 1)

    return project
  }
}
