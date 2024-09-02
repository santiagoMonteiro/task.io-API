import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { createTask } from './create-task'
import { updateTask } from './update-task'
import { fetchProjectTasks } from './fetch-project-tasks'
import { deleteTask } from './delete-task'

export async function taskRoutes(app: FastifyInstance) {
  // Authenticated
  app.post('/task', { onRequest: [verifyJWT] }, createTask)
  app.get('/task/:projectId', { onRequest: [verifyJWT] }, fetchProjectTasks)
  app.put('/task', { onRequest: [verifyJWT] }, updateTask)
  app.delete('/task/:taskId', { onRequest: [verifyJWT] }, deleteTask)
}