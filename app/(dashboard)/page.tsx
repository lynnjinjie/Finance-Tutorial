'use client'
import { Button } from '@/components/ui/button'
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts'
import { useNewAccounts } from '@/features/accounts/hooks/use-new-accout'

export default function Home() {
  const accountsQuery = useGetAccounts()
  const { onOpen } = useNewAccounts()

  return (
    <div>
      {accountsQuery.data?.map((account) => {
        return <div>{account.name}</div>
      })}
      <Button onClick={onOpen}>add new account</Button>
    </div>
  )
}
