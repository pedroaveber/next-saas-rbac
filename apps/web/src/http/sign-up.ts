import { api } from './api-client'

interface SignUpRequest {
  name: string
  email: string
  password: string
}

export async function signUp({ email, name, password }: SignUpRequest) {
  await api.post('users', {
    json: {
      name,
      email,
      password,
    },
  })
}
