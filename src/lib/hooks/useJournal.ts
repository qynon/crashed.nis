import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Journal, JournalQuarter } from '@/shared/types'

export const useJournal = () => {
  return useQuery<Journal>({
    queryKey: ['journal'],
    queryFn: async () => {
      const supabase = createClient()
      const { data: auth, error: authError } = await supabase.auth.getUser()

      if (authError || !auth.user) {
        throw new Error('Не удалось получить данные пользователя')
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('class_id')
        .eq('id', auth.user.id)
        .single()

      if (profileError || !profile?.class_id) {
        throw new Error('У пользователя не указан класс')
      }

      const { data: subjects, error: subjectsError } = await supabase
        .from('subjects')
        .select('id, name')
        .eq('class_id', profile.class_id)
        .order('name')

      if (subjectsError) {
        throw new Error('Не удалось загрузить предметы')
      }

      const { data: entries, error: entriesError } = await supabase
        .from('journal_entries')
        .select('subject_id, quarter, current_score, mark')
        .eq('student_id', auth.user.id)

      if (entriesError) {
        throw new Error('Не удалось загрузить журнал')
      }

      const quarters: JournalQuarter[] = [1, 2, 3, 4].map((number) => ({
        number: number as 1 | 2 | 3 | 4,
        subjects: (subjects ?? []).map((subject) => {
          const entry = entries?.find(
            (e) => e.subject_id === subject.id && e.quarter === number,
          )
          return {
            id: subject.id,
            name: subject.name,
            currScore: entry?.current_score ?? null,
            mark: entry?.mark ?? null,
          }
        }),
      }))

      return quarters
    },
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
  })
}
