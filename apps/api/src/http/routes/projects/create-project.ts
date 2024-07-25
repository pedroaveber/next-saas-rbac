import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { authenticationMiddleware } from '@/http/middlewares/authentication-middleware'
import { prisma } from '@/lib/prisma'
import { createSlug } from '@/utils/create-slug'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_error/unauthorized-error'

export async function createProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .post(
      '/organizations/:slug/projects',
      {
        schema: {
          tags: ['Projects'],
          summary: 'Create a new project in an organization',
          security: [{ BearerAuth: [] }],
          body: z.object({
            name: z.string(),
            description: z.string(),
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              projectId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params

        const userId = await request.getCurrentUserId()
        const { membership, organization } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('create', 'Project')) {
          throw new UnauthorizedError(
            'User does not have permission to create a project in this organization',
          )
        }

        const { name, description } = request.body
        const project = await prisma.project.create({
          data: {
            name,
            description,
            slug: createSlug(name),
            organizationId: organization.id,
            ownerId: userId,
          },
        })

        return reply.status(201).send({
          projectId: project.id,
        })
      },
    )
}
