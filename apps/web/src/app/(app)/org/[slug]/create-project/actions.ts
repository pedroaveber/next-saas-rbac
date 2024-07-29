'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { getCurrentOrganization } from '@/auth/auth'
import { createProject } from '@/http/create-project'

const createProjectSchema = z.object({
  name: z
    .string()
    .min(4, { message: 'Please provide a name with at least 4 characters' }),
  description: z.string(),
})

export async function createProjectAction(data: FormData) {
  const result = createProjectSchema.safeParse(Object.fromEntries(data))

  if (result.success === false) {
    const errors = result.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { name, description } = result.data

  try {
    await createProject({
      description,
      name,
      organizationSlug: getCurrentOrganization()!,
    })
    return {
      success: true,
      message: 'Project created successfully',
      errors: null,
    }
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json<{ message: string }>()
      return { success: false, message, errors: null }
    }

    console.error(error)
    return {
      success: false,
      message: 'Unexpected error. Please try again in a few minutes.',
      errors: null,
    }
  }
}
