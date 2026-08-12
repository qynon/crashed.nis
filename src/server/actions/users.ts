'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export type ActionResult = { success: true } | { success: false; error: string }

async function assertIsAdmin() {
  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getUser()

  if (!auth.user) {
    return { ok: false as const, error: 'Требуется вход в систему.' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', auth.user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { ok: false as const, error: 'Недостаточно прав.' }
  }

  return { ok: true as const }
}

export async function createStudent(input: {
  email: string
  password: string
  lastName: string
  firstName: string
  secondName?: string
  classId: string
}): Promise<ActionResult> {
  const check = await assertIsAdmin()
  if (!check.ok) return { success: false, error: check.error }

  const admin = createAdminClient()
  const { error } = await admin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: {
      role: 'student',
      last_name: input.lastName,
      first_name: input.firstName,
      second_name: input.secondName ?? null,
      class_id: input.classId,
    },
  })

  if (error) {
    return { success: false, error: 'Не удалось создать ученика. Проверьте email.' }
  }

  revalidatePath('/admin/students')
  return { success: true }
}

export async function deleteStudent(studentId: string): Promise<ActionResult> {
  const check = await assertIsAdmin()
  if (!check.ok) return { success: false, error: check.error }

  const admin = createAdminClient()
  const { error } = await admin.auth.admin.deleteUser(studentId)

  if (error) {
    return { success: false, error: 'Не удалось удалить ученика.' }
  }

  revalidatePath('/admin/students')
  return { success: true }
}

export async function updateStudentClass(
  studentId: string,
  classId: string | null,
): Promise<ActionResult> {
  const check = await assertIsAdmin()
  if (!check.ok) return { success: false, error: check.error }

  const supabase = await createClient()
  const { error } = await supabase
    .from('profiles')
    .update({ class_id: classId })
    .eq('id', studentId)

  if (error) {
    return { success: false, error: 'Не удалось обновить класс ученика.' }
  }

  revalidatePath('/admin/students')
  return { success: true }
}
