import { roleSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function getOrganizations(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Get organizations where user is a member',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              organizations: z.array(
                z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  slug: z.string(),
                  domain: z.string().nullable(),
                  shouldAttachUsersByDomain: z.boolean(),
                  role: roleSchema,
                  avatarUrl: z.string().nullable(),
                  createdAt: z.date(),
                  updatedAt: z.date(),
                  ownerId: z.string().uuid(),
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
            id: true,
            name: true,
            slug: true,
            domain: true,
            members: {
              select: {
                role: true,
              },
              where: {
                userId,
              },
            },
            shouldAttachUsersByDomain: true,
            avatarUrl: true,
            createdAt: true,
            updatedAt: true,
            ownerId: true,
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
          ({ members, ...org }) => {
            return {
              ...org,
              role: members[0].role,
            }
          },
        )

        return {
          organizations: organizationsWithUserRole,
        }
      },
    )
}
