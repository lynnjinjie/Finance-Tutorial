'use client'
import { Button } from '@/components/ui/button'
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts'
import { useNewAccount } from '@/features/accounts/hooks/use-new-accout'

export default function Home() {
  const accountsQuery = useGetAccounts()
  const { onOpen } = useNewAccount()

  return (
    <div>
      {accountsQuery.data?.map((account) => {
        return <div>{account.name}</div>
      })}
      <Button onClick={onOpen}>add new account</Button>
    </div>
  )
}
