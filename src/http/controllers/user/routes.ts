import { FastifyInstance } from 'fastify'
import { register } from './register'
import { authenticate } from './authenticate'
import { profile } from './profile'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.get('/sessions', authenticate)
  // Authorized
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}