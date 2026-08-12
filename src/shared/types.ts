export type Role = 'admin' | 'student'

export type Profile = {
  id: string
  role: Role
  lastName: string
  firstName: string
  secondName: string | null
  classId: string | null
  className: string | null
}

export type SchoolClass = {
  id: string
  name: string
}

export type Subject = {
  id: string
  classId: string
  name: string
}

export type JournalSubject = {
  id: string
  name: string
  currScore: number | null
  mark: number | null
}

export type JournalQuarter = {
  number: 1 | 2 | 3 | 4
  subjects: JournalSubject[]
}

export type Journal = JournalQuarter[]

export type ReportRow = {
  subject: {
    id: string
    name: string
  }
  firstPeriod: number | null
  secondPeriod: number | null
  thirdPeriod: number | null
  fourthPeriod: number | null
  firstHalfYearMark: number | null
  secondHalfYearMark: number | null
  yearMark: number | null
  examMark: number | null
  resultMark: number | null
}

export type ReportCard = {
  schoolYear: {
    id: string
    name: string
    isCurrent: boolean
  }
  reportCard: ReportRow[]
}

export type Reports = ReportCard[]

export type StudentListItem = {
  id: string
  lastName: string
  firstName: string
  secondName: string | null
  classId: string | null
  className: string | null
  email: string | null
}
