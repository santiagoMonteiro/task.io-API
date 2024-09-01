import { FastifyInstance } from 'fastify'
import { getProject } from './get-project'
import { createProject } from './create-project'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { updateProject } from './update-project'
import { deleteProject } from './delete-project'

export async function projectRoutes(app: FastifyInstance) {
  // Authenticated
  app.get('/project', { onRequest: [verifyJWT] }, getProject)
  app.post('/project', { onRequest: [verifyJWT] }, createProject)
  app.put('/project', { onRequest: [verifyJWT] }, updateProject)
  app.delete('/project', { onRequest: [verifyJWT] }, deleteProject)
}
