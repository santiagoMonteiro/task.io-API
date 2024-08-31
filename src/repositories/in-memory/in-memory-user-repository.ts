import { User } from '@prisma/client'
import {
  UserCreateInput,
  UserRepository,
} from '../user-repository'
import { randomUUID } from 'crypto'

export class InMemoryUserRepository implements UserRepository {
  private items: User[] = []

  async create(data: UserCreateInput) {
    const user: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.items.push(user)

    return user
  }

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id)

    if (!user) {
      return null
    }
    return user
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }
    return user
  }

  // async update(id: string, data: UserUpdateInput) {
  //   const userIndex = this.items.findIndex((item) => item.id === id)

  //   if (userIndex === -1) {
  //     return null
  //   }

  //   const updatedUser: User = {
  //     ...this.items[userIndex],
  //     ...data,
  //   }

  //   this.items[userIndex] = updatedUser

  //   return updatedUser
  // }

  // async delete(id: string) {
  //   const userIndex = this.items.findIndex((item) => item.id === id)
  //   const user = this.items[userIndex]

  //   if (userIndex === -1) {
  //     return null
  //   }

  //   this.items.splice(userIndex, 1)

  //   return user
  // }
}
