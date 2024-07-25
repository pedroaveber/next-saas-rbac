import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { authenticationMiddleware } from '@/http/middlewares/authentication-middleware'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_error/bad-request-error'
import { UnauthorizedError } from '../_error/unauthorized-error'

export async function getProjectDetails(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .get(
      '/organizations/:organizationSlug/projects/:projectSlug',
      {
        schema: {
          tags: ['Projects'],
          summary: 'Get project details',
          security: [{ BearerAuth: [] }],
          params: z.object({
            organizationSlug: z.string(),
            projectSlug: z.string(),
          }),
          response: {
            201: z.object({
              project: z.object({
                name: z.string(),
                id: z.string().uuid(),
                slug: z.string(),
                avatarUrl: z.string().url().nullable(),
                ownerId: z.string().uuid(),
                organizationId: z.string().uuid(),
                description: z.string(),
                owner: z.object({
                  name: z.string().nullable(),
                  id: z.string().uuid(),
                  avatarUrl: z.string().url().nullable(),
                }),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { organizationSlug, projectSlug } = request.params

        const userId = await request.getCurrentUserId()
        const { membership, organization } =
          await request.getUserMembership(organizationSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Project')) {
          throw new UnauthorizedError(
            'User does not have permission to view a project in this organization',
          )
        }

        const project = await prisma.project.findUnique({
          where: {
            slug: projectSlug,
            organizationId: organization.id,
          },
          select: {
            id: true,
            name: true,
            slug: true,
            ownerId: true,
            description: true,
            avatarUrl: true,
            organizationId: true,
            owner: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        })

        if (project === null) {
          throw new BadRequestError('Project not found')
        }

        return reply.send({ project })
      },
    )
}
