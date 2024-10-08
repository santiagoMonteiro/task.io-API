import fastify from 'fastify'
import { userRoutes } from './http/controllers/user/routes'
import { ZodError } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'
import { projectRoutes } from './http/controllers/project/routes'
import { taskRoutes } from './http/controllers/task/routes'
import cors from '@fastify/cors'

export const app = fastify()

app.register(cors, {
  origin: '*'
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(userRoutes)
app.register(projectRoutes)
app.register(taskRoutes)

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.format(),
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return reply.status(500).send({ message: 'Internal Server Error' })
})
