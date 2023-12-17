import bcryptjs from 'bcryptjs'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from './db'
import NextAuth, { getServerSession } from 'next-auth/next'
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next'

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

    async jwt({ token, user }) {
      const prismaUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      })

      if (!prismaUser) {
        token.id = user.id
        return token
      }
      if (!prismaUser.username) {
        await db.user.update({
          where: {
            id: prismaUser.id,
          },
          data: {
            // Elon Musk => elonmusk
            username: prismaUser.name?.split(' ').join('').toLowerCase(),
          },
        })
      }
      return {
        id: prismaUser.id,
        name: prismaUser.name,
        email: prismaUser.email,
        username: prismaUser.username,
        picture: prismaUser.image,
      }
    },
  },

  debug: process.env.NODE_ENV === 'development',

  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)

// Use it in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions)
}
