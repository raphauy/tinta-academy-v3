'use server'

import { checkRole } from '@/lib/roles'
import { clerkClient } from '@clerk/nextjs/server'

export async function setRole(formData: FormData) {
  if (!checkRole('admin')) {
    throw new Error('Not authorized')
  }

  try {
    const res = await clerkClient().users.updateUser(formData.get('id') as string, {
      publicMetadata: { role: formData.get('role') },
    })
    
  } catch (err) {
    throw new Error(err as string)
  }
}