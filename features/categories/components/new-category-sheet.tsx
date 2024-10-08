import { z } from 'zod'

import { useNewCategory } from '@/features/categories/hooks/use-new-category'
import { useCreateCategory } from '@/features/categories/api/use-create-category'
import { insertCategorizeSchema } from '@/db/schema'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { CategoryForm } from './category-form'

const formSchema = insertCategorizeSchema.pick({ name: true })
type FormValues = z.input<typeof formSchema>

export const NewCategorySheet = () => {
  const { isOpen, onClose } = useNewCategory()
  const mutation = useCreateCategory()
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
          <SheetTitle>New Category</SheetTitle>
          <SheetDescription>
            Create a new category to organize your transactions
          </SheetDescription>
        </SheetHeader>
        <CategoryForm
          onSubmit={onSubmit}
          defaultValues={{ name: '' }}
          disabled={mutation.isPending}
        />
      </SheetContent>
    </Sheet>
  )
}
