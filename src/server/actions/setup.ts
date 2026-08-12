'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export type CreateFirstAdminResult =
  | { success: true }
  | { success: false; error: string }

/**
 * Creates the very first administrator account. Only works while no
 * administrator exists yet — once one is created, this action always fails,
 * permanently closing this route off from further use.
 */
export async function createFirstAdmin(
  email: string,
  password: string,
  lastName: string,
  firstName: string,
): Promise<CreateFirstAdminResult> {
  const admin = createAdminClient()

  const { count, error: countError } = await admin
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('role', 'admin')

  if (countError) {
    return { success: false, error: 'Не удалось проверить наличие администратора.' }
  }

  if (count && count > 0) {
    return { success: false, error: 'Администратор уже создан.' }
  }

  const { error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      role: 'admin',
      last_name: lastName,
      first_name: firstName,
    },
  })

  if (createError) {
    return { success: false, error: 'Не удалось создать администратора. Проверьте данные.' }
  }

  return { success: true }
}
