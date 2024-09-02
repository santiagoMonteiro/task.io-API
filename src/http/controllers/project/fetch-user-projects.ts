import { ProjectRepositoryImpl } from '@/repositories/prisma/project-repository-impl'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { FetchUserProjectsUseCase } from '@/use-cases/project/fetch-user-projects'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchUserProjects(request: FastifyRequest, reply: FastifyReply) {
  try {
    const projectRepository = new ProjectRepositoryImpl()
    const fetchUserProjectsUseCase = new FetchUserProjectsUseCase(projectRepository)

    const { projects } = await fetchUserProjectsUseCase.execute({
      userId: request.user.sub,
    })

    return reply.status(200).send({
      projects
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
