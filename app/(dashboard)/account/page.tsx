'use client'
import { useNewAccounts } from '@/features/accounts/hooks/use-new-accout'
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts'
import { useBulkDeleteAccounts } from '@/features/accounts/api/use-bulk-delete'

import { Loader2, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { DataTable } from '@/components/data-table'
import { columns } from './columns'

export default function AccountPage() {
  const useNewAccount = useNewAccounts()
  const accountsQuery = useGetAccounts()
  const accounts = accountsQuery.data || []
  const deleteAccounts = useBulkDeleteAccounts()

  const isDisabled = deleteAccounts.isPending || accountsQuery.isLoading

  if (accountsQuery.isPending) {
    return (
      <div className="max-w-screen-2xl mx-auto">
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

  return (
    <div className="max-w-screen-2xl mx-auto">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="lg:flex-row lg:items-center lg:justify-between gap-y-2">
          <CardTitle className="text-xl line-clamp-1">Accout page</CardTitle>
          <Button size="sm" onClick={useNewAccount.onOpen}>
            <Plus className="size-4 mr-2" />
            Add New
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKey="name"
            columns={columns}
            data={accounts}
            onDelete={(rows) => {
              const ids = rows.map((row) => row.original.id)
              deleteAccounts.mutate({ ids })
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  )
}
