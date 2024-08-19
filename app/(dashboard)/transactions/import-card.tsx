import { useState } from 'react'
import { format, parse } from 'date-fns'

import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { convertAmountToMilliUnits } from '@/lib/utils'

import { ImportTable } from './import-table'

const dateFormat = 'yyyy-MM-dd HH:mm:ss'
const outputFormat = 'yyyy-MM-dd'

const requiredOptions = ['amount', 'date', 'payee']

interface SelectedColumnsState {
  [key: string]: string | null
}

type Props = {
  data: string[][]
  onCancel: () => void
  onSubmit: (data: any) => void
}

export const ImportCard = ({ data, onCancel, onSubmit }: Props) => {
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>(
    {}
  )
  const headers = data[0]
  const body = data.slice(1)

  const onTableHeadSelectChange = (
    columnIndex: number,
    value: string | null
  ) => {
    setSelectedColumns((prev) => {
      const newSelectedColumns = { ...prev }

      for (const key in newSelectedColumns) {
        if (newSelectedColumns[key] === value) {
          newSelectedColumns[key] = null
        }
      }

      if (value === 'skip') {
        value = null
      }

      newSelectedColumns[`column_${columnIndex}`] = value
      return newSelectedColumns
    })
  }

  const progress = Object.values(selectedColumns).filter(Boolean).length

  const handleContinue = () => {
    const getColumnIndex = (column: string) => {
      return column.split('_')[1]
    }

    const mappedData = {
      headers: headers.map((_header, index) => {
        const columnIndex = getColumnIndex(`column_${index}`)
        return selectedColumns[`column_${columnIndex}`] || null
      }),
      body: body
        .map((row) => {
          const transformedRow = row.map((cell, index) => {
            const columnIndex = getColumnIndex(`column_${index}`)
            return selectedColumns[`column_${columnIndex}`] ? cell : null
          })

          return transformedRow.every((item) => item === null)
            ? []
            : transformedRow
        })
        .filter((item) => item.length > 0),
    }
    const arrayOfData = mappedData.body.map((row) => {
      return row.reduce((acc: any, cell, index) => {
        const header = mappedData.headers[index]
        if (header !== null) {
          acc[header] = cell
        }
        return acc
      }, {})
    })

    const formattedData = arrayOfData.map((item) => {
      return {
        ...item,
        amount: convertAmountToMilliUnits(parseFloat(item.amount)),
        date: format(parse(item.date, dateFormat, new Date()), outputFormat),
      }
    })
    onSubmit(formattedData)
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="lg:flex-row lg:items-center lg:justify-between gap-y-2">
          <CardTitle className="text-xl line-clamp-1">
            Import Transaction
          </CardTitle>
          <div className="flex flex-col lg:flex-row items-center gap-x-2 gap-y-2">
            <Button size="sm" onClick={onCancel} className="w-full lg:w-auto">
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={progress < requiredOptions.length}
              className="w-full lg:w-auto"
              onClick={handleContinue}
            >
              Continue ({progress} / {requiredOptions.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ImportTable
            headers={headers}
            body={body}
            selectedColumns={selectedColumns}
            onTableHeadSelectChange={onTableHeadSelectChange}
          />
        </CardContent>
      </Card>
    </div>
  )
}
