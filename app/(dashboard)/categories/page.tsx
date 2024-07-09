'use client'
import { useNewCategory } from '@/features/categories/hooks/use-new-category'
import { useGetCategories } from '@/features/categories/api/use-get-categories'
import { useBulkDeleteCategories } from '@/features/categories/api/use-bulk-delete'

import { Loader2, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { DataTable } from '@/components/data-table'
import { columns } from './columns'

export default function CategoriesPage() {
  const newCategory = useNewCategory()
  const categoriesQuery = useGetCategories()
  const categories = categoriesQuery.data || []
  const deleteCategories = useBulkDeleteCategories()

  const isDisabled = deleteCategories.isPending || categoriesQuery.isLoading

  if (categoriesQuery.isPending) {
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

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="lg:flex-row lg:items-center lg:justify-between gap-y-2">
          <CardTitle className="text-xl line-clamp-1">
            Categories page
          </CardTitle>
          <Button size="sm" onClick={newCategory.onOpen}>
            <Plus className="size-4 mr-2" />
            Add New
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKey="name"
            columns={columns}
            data={categories}
            onDelete={(rows) => {
              const ids = rows.map((row) => row.original.id)
              deleteCategories.mutate({ ids })
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  )
}
