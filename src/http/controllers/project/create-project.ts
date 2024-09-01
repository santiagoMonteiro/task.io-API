import { ProjectRepositoryImpl } from '@/repositories/prisma/project-repository-impl'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { CreateProjectUseCase } from '@/use-cases/project/create-project'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createProject(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const createProjectBodySchema = z.object({
    name: z.string(),
    deliveryDate: z.coerce.date(),
    description: z.string().nullable(),
  })

  const { name, deliveryDate, description } = createProjectBodySchema.parse(
    request.body
  )

  try {
    const projectRepository = new ProjectRepositoryImpl()
    const createProjectUseCase = new CreateProjectUseCase(projectRepository)

    const { project } = await createProjectUseCase.execute({
      userId: request.user.sub,
      name,
      deliveryDate,
      description: description ?? undefined,
    })

    return reply.status(200).send({
      project,
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
