'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { signIn } from 'next-auth/react'

import Link from 'next/link'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const FormSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  username: z.string().min(1, 'Username is required'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must have at least 6 characters'),
})

const SignInForm = () => {
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const signInData = await signIn('credentials', {
      email: values.email,
      username: values.username,
      password: values.password,
      redirect: false,
    })

    if (signInData?.error) {
      toast({
        title: 'Error',
        description:
          'Username and Password must exactly equal those registered!',
        variant: 'destructive',
      })
    } else {
      router.refresh()
      router.push('/dashboard')
    }
  }

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div
        className="
        bg-slate-600
          px-4
          py-8
          shadow
          sm:rounded-lg
          sm:px-10
        "
      >
        <div className="b mb-2 text-2xl font-bold text-slate-200">
          <h2>Signin</h2>
        </div>
        <div className="mb-2  text-slate-400 ">
          <h3>Signin to access dashboard</h3>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="pb-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-slate-200">
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
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-slate-200">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Company Example Ltd" {...field} />
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
                    <FormLabel className="font-semibold text-slate-200">
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

            <div className="flex w-full items-center justify-end space-x-2 pt-6">
              <Button
                className="w-full bg-blue-800 hover:bg-blue-500"
                type="submit"
              >
                <p className="text-slate-200">Signin</p>
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
            <p className="mt-2 text-center text-sm text-gray-600">
              <span className="text-slate-200">
                If you don&apos;t have an account, please&nbsp;
              </span>

              <Link className="text-blue-300 hover:underline" href="/sign-up">
                Signup
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignInForm
