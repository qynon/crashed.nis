import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/shared/types'

export const useProfile = () => {
  return useQuery<Profile>({
    queryKey: ['profile'],
    queryFn: async () => {
      const supabase = createClient()
      const { data: auth, error: authError } = await supabase.auth.getUser()

      if (authError || !auth.user) {
        throw new Error('Не удалось получить данные пользователя')
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, role, last_name, first_name, second_name, class_id, classes(name)')
        .eq('id', auth.user.id)
        .single()

      if (error || !data) {
        throw new Error('Не удалось загрузить профиль')
      }

      return {
        id: data.id,
        role: data.role,
        lastName: data.last_name,
        firstName: data.first_name,
        secondName: data.second_name,
        classId: data.class_id,
        className: (data.classes as unknown as { name: string } | null)?.name ?? null,
      }
    },
    staleTime: 1000 * 60 * 10,
    refetchInterval: false,
  })
}
