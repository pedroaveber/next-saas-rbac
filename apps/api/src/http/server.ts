import { fastifyCors } from '@fastify/cors'
import { fastifyJwt } from '@fastify/jwt'
import { fastifySwagger } from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { errorHandler } from './error-handler'
import { authenticateWithPassword } from './routes/authentication/authenticate-with-password'
import { createAccount } from './routes/authentication/create-account'
import { getAuthenticatedUserProfile } from './routes/authentication/get-authenticated-user-profile'
import { requestPasswordRecover } from './routes/authentication/request-password-recover'
import { resetPassword } from './routes/authentication/reset-password'

const app = fastify().withTypeProvider<ZodTypeProvider>()

// Error Handling
app.setErrorHandler(errorHandler)

// Json Web Token
app.register(fastifyJwt, {
  secret: 'my-jwt-secret',
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
    servers: [],
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
app.register(requestPasswordRecover)
app.register(resetPassword)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('🔥 HTTP Server Running')
  })
