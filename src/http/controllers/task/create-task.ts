import { ProjectRepositoryImpl } from '@/repositories/prisma/project-repository-impl'
import { TaskRepositoryImpl } from '@/repositories/prisma/task-repository-impl'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { CreateTaskUseCase } from '@/use-cases/task/create-task'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createTask(request: FastifyRequest, reply: FastifyReply) {
  const createTaskBodySchema = z.object({
    name: z.string(),
    status: z.enum(['TODO', 'DOING', 'DONE']),
    projectId: z.string(),
    description: z.string().nullable(),
  })

  const { name, status, projectId, description } = createTaskBodySchema.parse(
    request.body
  )

  try {
    const projectRepository = new ProjectRepositoryImpl()
    const taskRepository = new TaskRepositoryImpl()

    const createTaskUseCase = new CreateTaskUseCase(
      projectRepository,
      taskRepository
    )

    const { task } = await createTaskUseCase.execute({
      userId: request.user.sub,
      name,
      status,
      projectId,
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
