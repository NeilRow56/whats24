import bcryptjs from 'bcryptjs'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { db } from './db'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),

  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        // email: { label: 'email', type: 'text' },
        username: { label: 'username', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        // if (!credentials?.email || !credentials?.password) {
        //   // throw new Error('Invalid credentials')
        //   return null
        // }
        // const existingUser = await db.user.findUnique({
        //   where: {
        //     email: credentials?.email,
        //   },
        // })
        if (!credentials?.username || !credentials?.password) {
          // throw new Error('Invalid credentials')
          return null
        }
        const existingUser = await db.user.findUnique({
          where: {
            username: credentials?.username,
          },
        })
        if (!existingUser || !existingUser?.hashedPassword) {
          // throw new Error('Invalid credentials')
          return null
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
    signIn: '/sign-n',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          username: user.name,
        }
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          username: token.username,
        },
      }
    },
  },
  debug: process.env.NODE_ENV === 'development',

  secret: process.env.NEXTAUTH_SECRET,
}
