import { roleSchema } from '@saas/auth/src/roles'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { authenticationMiddleware } from '@/http/middlewares/authentication-middleware'
import { prisma } from '@/lib/prisma'

export async function getOrganizations(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .get(
      '/organizations',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Get organization where user is a member',
          security: [{ BearerAuth: [] }],
          response: {
            200: z.object({
              organizations: z.array(
                z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  slug: z.string(),
                  domain: z.string().nullable(),
                  avatarUrl: z.string().url().nullable(),
                  role: roleSchema,
                }),
              ),
            }),
          },
        },
      },
      async (request) => {
        const userId = await request.getCurrentUserId()
        const organizations = await prisma.organization.findMany({
          select: {
            avatarUrl: true,
            id: true,
            name: true,
            domain: true,
            slug: true,
            members: {
              select: {
                role: true,
              },
              where: {
                userId,
              },
            },
          },
          where: {
            members: {
              some: {
                userId,
              },
            },
          },
        })

        const organizationsWithUserRole = organizations.map(
          ({ members, ...organization }) => ({
            ...organization,
            role: members[0].role,
          }),
        )

        return {
          organizations: organizationsWithUserRole,
        }
      },
    )
}
