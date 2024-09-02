import { ProjectRepositoryImpl } from '@/repositories/prisma/project-repository-impl'
import { TaskRepositoryImpl } from '@/repositories/prisma/task-repository-impl'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { UpdateTaskUseCase } from '@/use-cases/task/update-task'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function updateTask(request: FastifyRequest, reply: FastifyReply) {
  const updateTaskBodySchema = z.object({
    taskId: z.string().uuid(),
    name: z.string(),
    status: z.enum(['TODO', 'DOING', 'DONE']),
    description: z.string().nullable(),
  })

  const { taskId, name, status, description } = updateTaskBodySchema.parse(
    request.body
  )

  try {
    const projectRepository = new ProjectRepositoryImpl()
    const taskRepository = new TaskRepositoryImpl()

    const updateTaskUseCase = new UpdateTaskUseCase(
      projectRepository,
      taskRepository
    )

    const { task } = await updateTaskUseCase.execute({
      id: taskId,
      userId: request.user.sub,
      name: name ?? undefined,
      status: status ?? undefined,
      description: description ?? undefined,
    })

    return reply.status(200).send({
      task,
    })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    if (err instanceof InvalidCredentialsError) {
      return reply.status(401).send({ message: err.message })
    }

    throw err
  }
}
