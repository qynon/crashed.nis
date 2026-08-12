import React, { FC } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ReportRow } from '@/shared/types'
import { FormattedMark } from '@/widgets/reports/ReportTable'

const ReportDetails: FC<{ report: ReportRow }> = ({ report }) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[75px]">I</TableHead>
            <TableHead className="w-[75px]">II </TableHead>
            <TableHead></TableHead>
            <TableHead className="w-[180px]">1-полугодие</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <FormattedMark mark={report.firstPeriod} />
            </TableCell>
            <TableCell>
              <FormattedMark mark={report.secondPeriod} />
            </TableCell>
            <TableCell></TableCell>
            <TableCell>
              <FormattedMark mark={report.firstHalfYearMark} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[75px]">III</TableHead>
            <TableHead className="w-[75px]">IV</TableHead>
            <TableHead></TableHead>
            <TableHead className="w-[180px]">2-полугодие</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <FormattedMark mark={report.thirdPeriod} />
            </TableCell>
            <TableCell>
              <FormattedMark mark={report.fourthPeriod} />
            </TableCell>
            <TableCell></TableCell>
            <TableCell>
              <FormattedMark mark={report.secondHalfYearMark} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[75px]">Год.</TableHead>
            <TableHead className="w-[75px]">Экз.</TableHead>
            <TableHead></TableHead>
            <TableHead className="w-[180px]">Итог</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <FormattedMark mark={report.yearMark} />
            </TableCell>
            <TableCell>
              <FormattedMark mark={report.examMark} />
            </TableCell>
            <TableCell></TableCell>
            <TableCell>
              <FormattedMark mark={report.resultMark} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  )
}

export default React.memo(ReportDetails)
