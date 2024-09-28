import { getUsersDAO } from "@/services/user-services"
import { UserDialog } from "./user-dialogs"
import { DataTable } from "./user-table"
import { columns } from "./user-columns"

import { redirect } from 'next/navigation'
import { clerkClient } from '@clerk/nextjs/server'
import { checkRole } from "@/lib/roles"
import { SearchUsers } from "./clerk-search-users"
import { setRole } from "./clerk-actions"

export default async function UserPage(params: { searchParams: { search?: string } }) {
  if (!checkRole('admin')) {
    redirect('/')
  }

  const query = params.searchParams.search

  const users = query ? (await clerkClient().users.getUserList({ query })).data : []

  const data= await getUsersDAO()

  return (
    <div className="w-full">      
      <h1 className="text-2xl font-bold text-center">Usuarios</h1>
      {/* <p>This page is restricted to users with the admin role.</p>

      <SearchUsers />

      {users.map((user) => {
        return (
          <div key={user.id}>
            <div>
              {user.firstName} {user.lastName}
            </div>
            <div>
              {
                user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)
                  ?.emailAddress
              }
            </div>
            <div>{user.publicMetadata.role as string}</div>
            <div>
              <form action={setRole}>
                <input type="hidden" value={user.id} name="id" />
                <input type="hidden" value="admin" name="role" />
                <button type="submit">Make Admin</button>
              </form>
            </div>
            <div>
              <form action={setRole}>
                <input type="hidden" value={user.id} name="id" />
                <input type="hidden" value="student" name="role" />
                <button type="submit">Make Student</button>
              </form>
            </div>
          </div>
        )
      })} */}

      <div className="container bg-white p-3 py-4 mx-auto mt-10 border rounded-md text-muted-foreground dark:text-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="User"/>      
      </div>

    </div>
  )
}
