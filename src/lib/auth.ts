import bcryptjs from 'bcryptjs'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from './db'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),

  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        username: { label: 'username', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const existingUser = await db.user.findUnique({
          where: {
            email: credentials?.email,
          },
        })

        if (!existingUser || !existingUser?.hashedPassword) {
          throw new Error('No user found')
          // return null
        }
        const isCorrectPassword = await bcryptjs.compare(
          credentials.password,
          existingUser.hashedPassword
        )
        if (!isCorrectPassword) {
          // throw new Error('Invalid credentials')
          return null
        }
        return {
          id: `${existingUser.id}`,
          username: existingUser.username,
          email: existingUser.email,
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/sign-in',
  },

  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
        session.user.username = token.username
      }
      return session
    },
  },

  debug: process.env.NODE_ENV === 'development',

  secret: process.env.NEXTAUTH_SECRET,
}
