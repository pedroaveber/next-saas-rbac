'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { signUp } from '@/http/sign-up'

const signUpSchema = z
  .object({
    name: z.string().refine((value) => value.split(' ').length > 1, {
      message: 'Please provide your first and last name',
    }),
    email: z
      .string()
      .email({ message: 'Please provide a valid e-mail address' }),
    password: z.string().min(6, {
      message: 'Please enter a password with at least 6 characters',
    }),
    passwordConfirmation: z.string().min(6, {
      message: 'Please enter a password with at least 6 characters',
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  })

export async function signUpAction(data: FormData) {
  const result = signUpSchema.safeParse(Object.fromEntries(data))

  if (result.success === false) {
    const errors = result.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { email, password, name } = result.data

  try {
    await signUp({ email, password, name })
    return { success: true, message: null, errors: null }
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
