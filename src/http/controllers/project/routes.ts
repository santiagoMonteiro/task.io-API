import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { createProject } from './create-project'
import { getProject } from './get-project'
import { updateProject } from './update-project'
import { deleteProject } from './delete-project'
import { fetchUserProjects } from './fetch-user-projects'

export async function projectRoutes(app: FastifyInstance) {
  // Authenticated
  app.post('/project', { onRequest: [verifyJWT] }, createProject)
  app.get('/project/:projectId', { onRequest: [verifyJWT] }, getProject)
  app.get('/projects', { onRequest: [verifyJWT] }, fetchUserProjects)
  app.put('/project', { onRequest: [verifyJWT] }, updateProject)
  app.delete('/project/:projectId', { onRequest: [verifyJWT] }, deleteProject)
}
