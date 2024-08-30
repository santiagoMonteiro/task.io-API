import { User, Prisma } from '@prisma/client'

export interface UserRepository {
  create(data: Prisma.UserCreateInput): Promise<User>
  findById(id: string): Promise<User | null>
  update(id: string, data: Prisma.UserUpdateInput)
  delete(id: string): Promise<void>
}
