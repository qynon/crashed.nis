import React, { FC } from 'react'
import JournalCard from './JournalCard'

type JournalElementProps = {
  subject: string
  subjectId: string
  currentScore: number | null
  mark?: number | null
  quarter: string
}

const JournalElement: FC<JournalElementProps> = ({
  subject,
  mark,
  currentScore,
}) => {
  return (
    <JournalCard subject={subject} mark={mark} currentScore={currentScore} />
  )
}

export default JournalElement
