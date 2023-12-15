import { db } from '@/lib/db'
import bcryptjs from 'bcryptjs'

import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { email, username, password } = body

  const hashedPassword = await bcryptjs.hash(password, 12)

  const user = await db.user.create({
    data: {
      email,
      username,
      hashedPassword,
    },
  })

  return NextResponse.json(user)
}
