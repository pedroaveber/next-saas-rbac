'use server'

import { redirect } from 'next/navigation'

export async function signInWithGithub() {
  const githubSignInUrl = new URL('login/oauth/authorize', 'https://github.com')
  githubSignInUrl.searchParams.set('client_id', 'Ov23li4eZxHBjA4ezk3X')
  githubSignInUrl.searchParams.set(
    'client_redirect_uri',
    'http://localhost:3000/api/auth/callback',
  )
  githubSignInUrl.searchParams.set('scope', 'user')

  redirect(githubSignInUrl.toString())
}
