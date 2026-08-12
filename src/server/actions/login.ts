'use server'

import { createClient } from '@/lib/supabase/server'

type LoginActionType = {
  errors?: {
    email?: string
    password?: string
  }
  success: boolean
}

export const login = async (
  email: string,
  password: string,
): Promise<LoginActionType> => {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    if (error.message.toLowerCase().includes('email not confirmed')) {
      return {
        errors: { email: 'Email не подтверждён. Обратитесь к администратору' },
        success: false,
      }
    }

    return {
      errors: { password: 'Неверный email или пароль' },
      success: false,
    }
  }

  return { success: true }
}
