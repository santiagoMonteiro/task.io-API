
import { prisma } from '@/lib/prisma'
import {
  TaskCreateInput,
  TaskRepository,
  TaskUpdateInput,
} from '../task-repository'

export class TaskRepositoryImpl implements TaskRepository {
  async create(data: TaskCreateInput) {
    const task = await prisma.task.create({
      data,
    })

    return task
  }

  async findById(id: string) {
    const task = await prisma.task.findUnique({
      where: {
        id,
      },
    })

    return task
  }

  async findManyByProjectId(projectId: string) {
    const tasks = await prisma.task.findMany({
      where: {
        project_id: projectId,
      },
    })

    return tasks
  }


  async update(id: string, data: TaskUpdateInput) {
    const task = await prisma.task.update({
      where: {
        id,
      },
      data,
    })

    return task
  }

  async delete(id: string) {
    const task = await prisma.task.delete({
      where: {
        id,
      },
    })

    return task
  }
}
