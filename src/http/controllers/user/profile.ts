import { UserRepositoryImpl } from '@/repositories/prisma/user-repository-impl'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { GetUserProfileUseCase } from '@/use-cases/user/get-user-profile'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  try {
    const usersRepository = new UserRepositoryImpl()
    const registerUseCase = new GetUserProfileUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      id: request.user.sub,
    })

    return reply.status(200).send({
      user: {
        ...user,
        password_hash: undefined,
      },
    })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    throw err
  }
}
