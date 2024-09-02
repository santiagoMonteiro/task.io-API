import { ProjectRepositoryImpl } from '@/repositories/prisma/project-repository-impl'
import { TaskRepositoryImpl } from '@/repositories/prisma/task-repository-impl'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { FetchProjectTasksUseCase } from '@/use-cases/task/fetch-project-tasks'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchProjectTasks(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const fetchProjectTasksParamsSchema = z.object({
    projectId: z.string().uuid(),
  })

  const { projectId } = fetchProjectTasksParamsSchema.parse(request.params)

  try {
    const projectRepository = new ProjectRepositoryImpl()
    const taskRepository = new TaskRepositoryImpl()

    const fetchUserTasksUseCase = new FetchProjectTasksUseCase(
      projectRepository,
      taskRepository
    )

    const { tasks } = await fetchUserTasksUseCase.execute({
      userId: request.user.sub,
      projectId,
    })

    return reply.status(200).send({
      tasks,
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
