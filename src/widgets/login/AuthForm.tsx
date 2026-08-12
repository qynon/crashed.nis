'use client'

import React from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Spinner } from '@phosphor-icons/react'
import { login } from '@/server/actions/login'
import { useRouter } from 'next/navigation'

const schema = z.object({
  email: z
    .string({ required_error: 'Email обязателен' })
    .email('Некорректный email'),
  password: z
    .string({ required_error: 'Пароль обязателен' })
    .min(6, 'Пароль должен быть не менее 6 символов'),
})

type AuthFormType = z.infer<typeof schema>

const AuthForm = () => {
  const form = useForm<AuthFormType>({
    resolver: zodResolver(schema),
  })

  const router = useRouter()

  const onSubmit: SubmitHandler<AuthFormType> = async ({ email, password }) => {
    const res = await login(email, password)
    if (res.success) {
      router.push('/dash')
      router.refresh()
    } else {
      if (res.errors?.email) form.setError('email', { message: res.errors.email })
      if (res.errors?.password)
        form.setError('password', { message: res.errors.password })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="mb-1 mt-1">
              <FormControl>
                <Input
                  placeholder="Email"
                  autoComplete="username"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage className="pb-1 leading-none text-destructive" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="mb-1 mt-1">
              <FormControl>
                <Input
                  placeholder="Пароль"
                  autoComplete="current-password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage className="pb-1 leading-none text-destructive" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="mt-2 w-full"
          disabled={form.formState.isSubmitting}
        >
          Продолжить
          {form.formState.isSubmitting ? (
            <Spinner className="ml-1 animate-spin-slow" />
          ) : (
            <ArrowRight className="ml-1" />
          )}
        </Button>
      </form>
    </Form>
  )
}

export default AuthForm
