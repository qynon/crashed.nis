import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { ReportCard, Reports } from '@/shared/types'

export const useReports = () => {
  return useQuery<Reports>({
    queryKey: ['reports'],
    queryFn: async () => {
      const supabase = createClient()
      const { data: auth, error: authError } = await supabase.auth.getUser()

      if (authError || !auth.user) {
        throw new Error('Не удалось получить данные пользователя')
      }

      const { data, error } = await supabase
        .from('report_marks')
        .select(
          'school_year, is_current, first_period, second_period, third_period, fourth_period, first_half_year, second_half_year, year_mark, exam_mark, result_mark, subjects(id, name)',
        )
        .eq('student_id', auth.user.id)

      if (error) {
        throw new Error('Не удалось загрузить табель')
      }

      const bySchoolYear = new Map<string, ReportCard>()

      for (const row of data ?? []) {
        const subject = row.subjects as unknown as { id: string; name: string } | null
        if (!subject) continue

        if (!bySchoolYear.has(row.school_year)) {
          bySchoolYear.set(row.school_year, {
            schoolYear: {
              id: row.school_year,
              name: row.school_year,
              isCurrent: row.is_current,
            },
            reportCard: [],
          })
        }

        bySchoolYear.get(row.school_year)!.reportCard.push({
          subject: { id: subject.id, name: subject.name },
          firstPeriod: row.first_period,
          secondPeriod: row.second_period,
          thirdPeriod: row.third_period,
          fourthPeriod: row.fourth_period,
          firstHalfYearMark: row.first_half_year,
          secondHalfYearMark: row.second_half_year,
          yearMark: row.year_mark,
          examMark: row.exam_mark,
          resultMark: row.result_mark,
        })
      }

      return Array.from(bySchoolYear.values()).sort((a, b) =>
        b.schoolYear.name.localeCompare(a.schoolYear.name),
      )
    },
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
  })
}
