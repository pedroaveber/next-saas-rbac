import { api } from './api-client'

interface GetAuthenticatedUserProfileResponse {
  user: {
    id: string
    name: string | null
    email: string
    avatarUrl: string | null
  }
}

export async function getAuthenticatedUserProfile() {
  const result = await api
    .get('profile')
    .json<GetAuthenticatedUserProfileResponse>()

  return result
}
