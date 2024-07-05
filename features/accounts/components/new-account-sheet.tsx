import { z } from 'zod'

import { useNewAccounts } from '@/features/accounts/hooks/use-new-accout'
import { insertAccountSchema } from '@/db/schema'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { AccountForm } from './account-form'
import { useCreateAccount } from '@/features/accounts/api/use-create-account'

const formSchema = insertAccountSchema.pick({ name: true })
type FormValues = z.input<typeof formSchema>

export const NewAccountSheet = () => {
  const { isOpen, onClose } = useNewAccounts()
  const mutation = useCreateAccount()
  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose()
      },
    })
  }
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Account</SheetTitle>
          <SheetDescription>
            Create a new account to track your transactions
          </SheetDescription>
        </SheetHeader>
        <AccountForm
          onSubmit={onSubmit}
          defaultValues={{ name: '' }}
          disabled={mutation.isPending}
        />
      </SheetContent>
    </Sheet>
  )
}
