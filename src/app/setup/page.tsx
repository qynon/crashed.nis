import { createAdminClient } from '@/lib/supabase/admin'
import { SetupForm } from '@/app/setup/SetupForm'

export const metadata = {
  title: 'Первоначальная настройка',
}

export default async function SetupPage() {
  const admin = createAdminClient()

  const { count } = await admin
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('role', 'admin')

  const adminExists = !!count && count > 0

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        {adminExists ? (
          <div className="rounded-lg border bg-card p-6 text-center">
            <h1 className="text-lg font-semibold">Настройка уже завершена</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Администратор уже создан. Эта страница больше недоступна.
            </p>
          </div>
        ) : (
          <SetupForm />
        )}
      </div>
    </main>
  )
}
