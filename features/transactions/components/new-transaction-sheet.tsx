import { z } from 'zod'
import { Loader2 } from 'lucide-react'

import { useNewTransaction } from '@/features/transactions/hooks/use-new-transaction'
import { useCreateTransaction } from '@/features/transactions/api/use-create-transaction'
import { TransactionForm } from '@/features/transactions/components/transaction-form'
import { useCreateCategory } from '@/features/categories/api/use-create-category'
import { useGetCategories } from '@/features/categories/api/use-get-categories'
import { useCreateAccount } from '@/features/accounts/api/use-create-account'
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts'
import { insertTransactionsSchema } from '@/db/schema'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

const formSchema = insertTransactionsSchema.omit({ id: true })
type FormValues = z.input<typeof formSchema>

export const NewTransactionSheet = () => {
  const { isOpen, onClose } = useNewTransaction()

  const createMutation = useCreateTransaction()

  const categoriesQuery = useGetCategories()
  const categoryMutation = useCreateCategory()
  const onCreateCategory = (name: string) => categoryMutation.mutate({ name })

  const categoryOptions = (categoriesQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }))

  const accountsQuery = useGetAccounts()
  const accountMutation = useCreateAccount()
  const onCreateAccount = (name: string) => accountMutation.mutate({ name })

  const accountOptions = (accountsQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }))

  const isPending =
    createMutation.isPending ||
    categoryMutation.isPending ||
    accountMutation.isPending

  const isLoading = categoriesQuery.isLoading || accountsQuery.isLoading

  const onSubmit = (values: FormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        onClose()
      },
    })
  }
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Transaction</SheetTitle>
          <SheetDescription>Create a new transaction</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <TransactionForm
            onSubmit={onSubmit}
            disabled={isPending}
            categoryOptions={categoryOptions}
            onCreateCategory={onCreateCategory}
            accountOptions={accountOptions}
            onCreateAccount={onCreateAccount}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
