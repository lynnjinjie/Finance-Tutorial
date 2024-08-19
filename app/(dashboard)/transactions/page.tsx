'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2, Plus } from 'lucide-react'

import { useNewTransaction } from '@/features/transactions/hooks/use-new-transaction'
import { useGetTransactions } from '@/features/transactions/api/use-get-transactions'
import { useBulkDeleteTransactions } from '@/features/transactions/api/use-bulk-delete-transactions'
import { useBulkCreateTransactions } from '@/features/transactions/api/use-bulk-create-transactions'

import { useSelectAccount } from '@/features/accounts/hooks/use-select-account'

import { transactions as transactionsSchema } from '@/db/schema'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { DataTable } from '@/components/data-table'

import { columns } from './columns'
import { UploadButton } from './upload-buttton'
import { ImportCard } from './import-card'

enum VARIANTS {
  LIST = 'LIST',
  IMPORT = 'IMPORT',
}

const INITIAL_IMPORT_RESULTS = {
  data: [],
  error: [],
  meta: {},
}

export default function TransactionPage() {
  const [AccountDialog, confirm] = useSelectAccount()
  const [variants, setVariants] = useState<VARIANTS>(VARIANTS.LIST)
  const [importResults, setImportResults] = useState<
    typeof INITIAL_IMPORT_RESULTS
  >(INITIAL_IMPORT_RESULTS)

  const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    setImportResults(results)
    setVariants(VARIANTS.IMPORT)
  }

  const onCancelImport = () => {
    setImportResults(INITIAL_IMPORT_RESULTS)
    setVariants(VARIANTS.LIST)
  }

  const newTransaction = useNewTransaction()
  const createTransactions = useBulkCreateTransactions()
  const transactionsQuery = useGetTransactions()
  const transactions = transactionsQuery.data || []
  const deleteTransactions = useBulkDeleteTransactions()

  const isDisabled = deleteTransactions.isPending || transactionsQuery.isLoading

  const onSubmitImport = async (
    values: (typeof transactionsSchema.$inferInsert)[]
  ) => {
    const accountId = await confirm()
    if (!accountId) {
      return toast.error('Please select an account to continue')
    }
    const data = values.map((value) => {
      return {
        ...value,
        accountId: accountId as string,
      }
    })

    createTransactions.mutate(data, {
      onSuccess: () => {
        onCancelImport()
      },
    })
  }

  if (transactionsQuery.isPending) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (variants === VARIANTS.IMPORT) {
    return (
      <>
        <AccountDialog />
        <ImportCard
          data={importResults.data}
          onCancel={onCancelImport}
          onSubmit={onSubmitImport}
        />
      </>
    )
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="lg:flex-row lg:items-center lg:justify-between gap-y-2">
          <CardTitle className="text-xl line-clamp-1">
            Transactions History
          </CardTitle>
          <div className="flex flex-col lg:flex-row items-center gap-x-2 gap-y-2">
            <Button
              size="sm"
              onClick={newTransaction.onOpen}
              className="w-full lg:w-auto"
            >
              <Plus className="size-4 mr-2" />
              Add New
            </Button>
            <UploadButton onUpload={onUpload} />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKey="payee"
            columns={columns}
            data={transactions}
            onDelete={(rows) => {
              const ids = rows.map((row) => row.original.id)
              deleteTransactions.mutate({ ids })
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  )
}
