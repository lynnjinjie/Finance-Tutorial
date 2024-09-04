'use client'
import { Button } from '@/components/ui/button'
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts'
import { useNewAccount } from '@/features/accounts/hooks/use-new-account'

export default function Home() {
  const accountsQuery = useGetAccounts()
  const { onOpen } = useNewAccount()

  return (
    <div>
      {accountsQuery.data?.map((account) => {
        return <div key={account.id}>{account.name}</div>
      })}
      <Button onClick={onOpen}>add new account</Button>
    </div>
  )
}
