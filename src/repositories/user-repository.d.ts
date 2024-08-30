import { Prisma, User } from '@prisma/client'

export type UserCreateInput = Omit<User, 'id' | 'created_at'>
export type UserUpdateInput = Omit<User, 'id' | 'created_at'>

export interface UserRepository {
  create(data: UserCreateInput): Promise<User>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  update(id: string, data: UserUpdateInput): Promise<User | null>
  delete(id: string): Promise<User | null>
}
