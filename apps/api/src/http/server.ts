import { fastifyCors } from '@fastify/cors'
import { fastifyJwt } from '@fastify/jwt'
import { fastifySwagger } from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { env } from '@saas/env'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { errorHandler } from './error-handler'
import { authenticateWithGithub } from './routes/authentication/authenticate-with-github'
import { authenticateWithPassword } from './routes/authentication/authenticate-with-password'
import { createAccount } from './routes/authentication/create-account'
import { getAuthenticatedUserProfile } from './routes/authentication/get-authenticated-user-profile'
import { requestPasswordRecover } from './routes/authentication/request-password-recover'
import { resetPassword } from './routes/authentication/reset-password'
import { getOrganizationBilling } from './routes/billing/get-organizaion-billing'
import { acceptInvite } from './routes/invites/accept-invite'
import { createInvite } from './routes/invites/create-invite'
import { getInviteDetails } from './routes/invites/get-invite-details'
import { getInvites } from './routes/invites/get-invites'
import { getPendingInvites } from './routes/invites/get-pending-invites'
import { rejectInvite } from './routes/invites/reject-invite'
import { revokeInvite } from './routes/invites/revoke-invite'
import { getMembers } from './routes/members/get-members'
import { removeMember } from './routes/members/remove-member'
import { updateMember } from './routes/members/update-member'
import { createOrganization } from './routes/organizations/create-organization'
import { getMembership } from './routes/organizations/get-membership'
import { getOrganizationDetails } from './routes/organizations/get-organization-details'
import { getOrganizations } from './routes/organizations/get-organizations'
import { shutdownOrganization } from './routes/organizations/shutdown-organization'
import { transferOrganizationOwnership } from './routes/organizations/transfer-organization-ownership'
import { updateOrganization } from './routes/organizations/update-organization'
import { createProject } from './routes/projects/create-project'
import { deleteProject } from './routes/projects/delete-project'
import { getProjectDetails } from './routes/projects/get-project-details'
import { getProjects } from './routes/projects/get-projects'
import { updateProject } from './routes/projects/update-project'

const app = fastify().withTypeProvider<ZodTypeProvider>()

// Error Handling
app.setErrorHandler(errorHandler)

// Json Web Token
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

// Type Provider
app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

// Docs
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Next.js SaaS',
      description: 'Full-stack SaaS App with mult-tenant & RBAC',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})

// Docs UI
app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

// Cors
app.register(fastifyCors)

// HTTP Routes
app.register(getAuthenticatedUserProfile)
app.register(createAccount)
app.register(authenticateWithPassword)
app.register(authenticateWithGithub)
app.register(requestPasswordRecover)
app.register(resetPassword)

app.register(getMembership)
app.register(getOrganizations)
app.register(getOrganizationDetails)
app.register(createOrganization)
app.register(updateOrganization)
app.register(shutdownOrganization)
app.register(transferOrganizationOwnership)

app.register(createProject)
app.register(deleteProject)
app.register(getProjectDetails)
app.register(getProjects)
app.register(updateProject)

app.register(getMembers)
app.register(updateMember)
app.register(removeMember)

app.register(createInvite)
app.register(getInviteDetails)
app.register(getInvites)
app.register(acceptInvite)
app.register(rejectInvite)
app.register(revokeInvite)
app.register(getPendingInvites)

app.register(getOrganizationBilling)
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhMGY4MzYzNS1jNmNiLTQyMGMtYjgwZS0wYWQ4MTAxMTM2ODkiLCJpYXQiOjE3MjE4NzI3ODUsImV4cCI6MTcyMjQ3NzU4NX0.5S6GucG0m3ObkHEm6IqBNjnWBYMB6bzYVwl0BwtwJeo

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('🔥 HTTP Server Running')
  })
