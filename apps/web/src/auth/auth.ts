import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getAuthenticatedUserProfile } from '@/http/get-authenticated-user-profile'

export function isAuthenticated() {
  return !!cookies().get('token')?.value
}

export async function auth() {
  const token = cookies().get('token')?.value

  if (!token) {
    redirect('/api/auth/sign-out')
  }

  try {
    return await getAuthenticatedUserProfile()
  } catch (error) {
    redirect('/api/auth/sign-out')
  }
}
