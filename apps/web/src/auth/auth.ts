import { defineAbilityFor } from '@saas/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getAuthenticatedUserProfile } from '@/http/get-authenticated-user-profile'
import { getMembership } from '@/http/get-membership'

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

export function getCurrentOrganization() {
  return cookies().get('org')?.value || null
}

export async function getCurrentMembership() {
  const org = getCurrentOrganization()

  if (!org) {
    return null
  }

  const { membership } = await getMembership(org)
  return membership
}

export async function ability() {
  const membership = await getCurrentMembership()

  if (!membership) {
    return null
  }

  return defineAbilityFor({
    id: membership.userId,
    role: membership.role,
  })
}
