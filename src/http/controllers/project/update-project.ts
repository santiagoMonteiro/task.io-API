import { ProjectRepositoryImpl } from '@/repositories/prisma/project-repository-impl'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { UpdateProjectUseCase } from '@/use-cases/project/update-project'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function updateProject(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const updateProjectBodySchema = z.object({
    projectId: z.string().uuid(),
    name: z.string().nullable(),
    deliveryDate: z.coerce.date().nullable(),
    description: z.string().nullable(),
  })

  const { projectId, name, deliveryDate, description } =
    updateProjectBodySchema.parse(request.body)

  try {
    const projectRepository = new ProjectRepositoryImpl()
    const updateProjectUseCase = new UpdateProjectUseCase(projectRepository)

    const { project } = await updateProjectUseCase.execute({
      id: projectId,
      userId: request.user.sub,
      name: name ?? undefined,
      deliveryDate: deliveryDate ?? undefined,
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
