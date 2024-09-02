import { ProjectRepositoryImpl } from '@/repositories/prisma/project-repository-impl'
import { TaskRepositoryImpl } from '@/repositories/prisma/task-repository-impl'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { DeleteTaskUseCase } from '@/use-cases/task/delete-task'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteTask(request: FastifyRequest, reply: FastifyReply) {
  const deleteTaskParamsSchema = z.object({
    taskId: z.string().uuid(),
  })

  const { taskId } = deleteTaskParamsSchema.parse(request.params)

  try {
    const projectRepository = new ProjectRepositoryImpl()
    const taskRepository = new TaskRepositoryImpl()
    const deleteTaskUseCase = new DeleteTaskUseCase(
      projectRepository,
      taskRepository
    )

    const { task } = await deleteTaskUseCase.execute({
      id: taskId,
      userId: request.user.sub,
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
