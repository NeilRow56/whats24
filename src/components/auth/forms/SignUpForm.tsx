'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { redirect } from 'next/navigation'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'

const FormSchema = z
  .object({
    username: z.string().min(1, 'Username is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must have at least 6 characters'),
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

export const SignUpForm = () => {
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    // Register User
    const response = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: values.username,
        email: values.email,
        password: values.password,
      }),
    })
    if (response.ok) {
      router.push('/sign-in')
    } else {
      toast({
        title: 'Error',
        description: 'Username or email already taken!',
        variant: 'destructive',
      })
    }
  }

  return (
    <>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md ">
        <div
          className="
        bg-white
          px-4
          py-8
          shadow
          sm:rounded-lg
          sm:px-10
        "
        >
          <div className="mb-2 text-2xl font-bold text-blue-800">
            <h2>Register</h2>
          </div>
          <div className="mb-2  text-gray-400 ">
            <h3>Sign up to create an account</h3>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="pb-3 ">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-blue-800">
                        Username
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pb-3">
                {' '}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-blue-800">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="mail@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="pb-3">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-blue-800">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pb-3">
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-blue-800">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Re-Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex w-full items-center justify-end space-x-2 pt-6">
                <Button
                  className="w-full bg-blue-800 hover:bg-blue-500"
                  type="submit"
                >
                  Register
                </Button>
              </div>
            </form>
          </Form>

          <div className="mt-6">
            <div
              className="
            mt-6 
            flex 
            justify-center 
            gap-2 
            px-2 
            text-sm 
            text-gray-500
          "
            >
              <div className="mt-2 text-center text-sm text-gray-600">
                If you already have an account, please&nbsp;
                <Link className="text-blue-500 hover:underline" href="/sign-in">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
