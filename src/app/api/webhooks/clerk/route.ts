import { headers } from 'next/headers'
import { Webhook } from 'svix'
//import { Client } from '@upstash/qstash'
import { WebhookEvent } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

import { createUser, updateUserByClerkUserId, UserFormValues } from '@/services/user-services'

//const qstashClient = new Client({ token: process.env.QSTASH_TOKEN as string })

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error(
      'Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local'
    )
  }

  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400
    })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occurred', {
      status: 400
    })
  }

  const eventType = evt.type

  if (eventType === 'user.created') {
    console.log('user.created')    
    const { id, email_addresses, first_name, last_name, image_url } = evt.data

    if (!id || !email_addresses || !email_addresses.length) {
      return new Response('Error occurred -- missing data', {
        status: 400
      })
    }

    const email = email_addresses[0].email_address

    const userValues: UserFormValues = {
        email: email,
        clerkUserId: id,
        firstName: first_name ?? undefined,
        lastName: last_name ?? undefined,
        imageUrl: image_url ?? undefined
    }

    try {
      const created= await createUser(userValues)
      if (!created) {
        throw new Error('Error occurred -- user not created')
      }
      revalidatePath(`/`)
    } catch (error) {
      return new Response('Error occurred', {
        status: 400
      })
    }

    // Trigger a workflow
    // try {
    //   await qstashClient.publishJSON({
    //     url: `${process.env.UPSTASH_WORKFLOW_URL}/api/workflow`,
    //     body: {
    //       user: {
    //         id: id,
    //         email: email,
    //         firstName: first_name,
    //         lastName: last_name
    //       }
    //     }
    //   })
    // } catch (error) {
    //   console.error('Error triggering workflow:', error)
    // }
  }

  if (eventType === 'user.updated') {
    const { id, first_name, last_name, image_url } = evt.data

    if (!id) {
      return new Response('Error occurred -- missing data', {
        status: 400
      })
    }

    const firstName= evt.data.first_name || undefined
    const lastName= evt.data.last_name || undefined
    const imageUrl= evt.data.image_url || undefined
    try {
      const updated= await updateUserByClerkUserId(id, firstName, lastName, imageUrl)
      if (!updated) {
        throw new Error('Error occurred -- user not updated')
      }
      revalidatePath(`/`)
    } catch (error) {
      return new Response('Error occurred', {
        status: 400
      })
    }
  }

  // TODO: implement the user:deleted event

  return new Response('', { status: 200 })
}