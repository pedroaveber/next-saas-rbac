import { api } from './api-client'

interface CreateProjectRequest {
  name: string
  description: string
  organizationSlug: string
}

export async function createProject({
  name,
  description,
  organizationSlug,
}: CreateProjectRequest) {
  await api.post(`organizations/${organizationSlug}/projects`, {
    json: {
      name,
      description,
    },
  })
}
