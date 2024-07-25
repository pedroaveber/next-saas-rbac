import { projectSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { authenticationMiddleware } from '@/http/middlewares/authentication-middleware'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_error/bad-request-error'
import { UnauthorizedError } from '../_error/unauthorized-error'

export async function updateProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .put(
      '/organizations/:organizationSlug/projects/:projectId',
      {
        schema: {
          tags: ['Projects'],
          summary: 'Update a project',
          security: [{ BearerAuth: [] }],
          params: z.object({
            organizationSlug: z.string(),
            projectId: z.string().uuid(),
          }),
          body: z.object({
            name: z.string(),
            description: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { organizationSlug, projectId } = request.params

        const userId = await request.getCurrentUserId()
        const { membership, organization } =
          await request.getUserMembership(organizationSlug)

        const project = await prisma.project.findUnique({
          where: {
            id: projectId,
            organizationId: organization.id,
          },
        })

        if (project === null) {
          throw new BadRequestError('Project not found')
        }

        const authProject = projectSchema.parse(project)
        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', authProject)) {
          throw new UnauthorizedError(
            'User does not have permission to update this project',
          )
        }

        const { description, name } = request.body

        await prisma.project.update({
          data: {
            description,
            name,
          },
          where: {
            id: projectId,
          },
        })

        return reply.status(204).send()
      },
    )
}
