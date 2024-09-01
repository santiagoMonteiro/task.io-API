import { ProjectRepositoryImpl } from '@/repositories/prisma/project-repository-impl'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { GetProjectUseCase } from '@/use-cases/project/get-project'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getProject(request: FastifyRequest, reply: FastifyReply) {
  const getProjectBodySchema = z.object({
    projectId: z.string().uuid(),
  })

  const { projectId } = getProjectBodySchema.parse(request.body)

  try {
    const projectRepository = new ProjectRepositoryImpl()
    const getProjectUseCase = new GetProjectUseCase(projectRepository)

    const { project } = await getProjectUseCase.execute({
      id: projectId,
      userId: request.user.sub,
    })

    return reply.status(200).send({
      project
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
