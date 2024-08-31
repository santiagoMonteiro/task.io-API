import { User } from '@prisma/client'
import { UserCreateInput, UserRepository } from '../user-repository'
import { prisma } from '@/lib/prisma'

export class UserRepositoryImpl implements UserRepository {
  async create(data: UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }
}
