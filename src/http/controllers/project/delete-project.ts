import { ProjectRepositoryImpl } from '@/repositories/prisma/project-repository-impl'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { DeleteProjectUseCase } from '@/use-cases/project/delete-project'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteProject(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const deleteProjectBodySchema = z.object({
    projectId: z.string().uuid(),
  })

  const { projectId } = deleteProjectBodySchema.parse(request.params)

  try {
    const projectRepository = new ProjectRepositoryImpl()
    const deleteProjectUseCase = new DeleteProjectUseCase(projectRepository)

    const { project } = await deleteProjectUseCase.execute({
      id: projectId,
      userId: request.user.sub,
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
