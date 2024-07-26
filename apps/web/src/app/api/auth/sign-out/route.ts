import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  cookies().delete('token')

  const redirectUrl = request.nextUrl.clone()
  redirectUrl.pathname = '/auth/sign-in'

  return NextResponse.redirect(redirectUrl)
}
