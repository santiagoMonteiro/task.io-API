import { Prisma, Task } from '@prisma/client'
import {
  TaskCreateInput,
  TaskRepository,
  TaskUpdateInput,
} from '../task-repository'
import { randomUUID } from 'crypto'

export class InMemoryTaskRepository implements TaskRepository {
  private items: Task[] = []

  async create(data: TaskCreateInput) {
    const task: Task = {
      id: randomUUID(),
      created_at: new Date(),
      description: data.description,
      name: data.name,
      status: data.status,
      project_id: data.project_id,
    }

    this.items.push(task)

    return task
  }

  async findById(id: string) {
    const task = this.items.find((item) => item.id === id)

    if (!task) {
      return null
    }
    return task
  }

  async findManyByProjectId(userId: string) {
    const tasks = this.items.filter((item) => item.id === userId)

    return tasks
  }

  async update(id: string, data: TaskUpdateInput) {
    const taskIndex = this.items.findIndex((item) => item.id === id)

    if (taskIndex === -1) {
      return null
    }

    const updatedTask: Task = {
      ...this.items[taskIndex],
      ...data,
    }

    this.items[taskIndex] = updatedTask

    return updatedTask
  }

  async delete(id: string) {
    const taskIndex = this.items.findIndex((item) => item.id === id)
    const task = this.items[taskIndex]

    if (taskIndex === -1) {
      return null
    }

    this.items.splice(taskIndex, 1)

    return task
  }
}
