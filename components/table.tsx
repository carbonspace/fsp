import { sql } from '@vercel/postgres'
import { timeAgo } from '@/lib/utils'
import Image from 'next/image'
import RefreshButton from './refresh-button'
import { seed } from '@/lib/seed'

export default async function Table() {
  let data
  let startTime = Date.now()

  try {
    data = await sql`SELECT * FROM skateparks`
  } catch (e: any) {
    if (e.message === `relation "skateparks" does not exist`) {
      console.log(
        'Table does not exist, creating and seeding it with dummy data now...'
      )
      // Table is not created yet
      await seed()
      startTime = Date.now()
      data = await sql`SELECT * FROM skateparks`
    } else {
      throw e
    }
  }

  const { rows: skateparks } = data
  const duration = Date.now() - startTime

  return (
    <div className="bg-white/30 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Recent Skateparks</h2>
          <p className="text-sm text-gray-500">
            Fetched {skateparks.length} skateparks in {duration}ms
          </p>
        </div>
        <RefreshButton />
      </div>
      <div className="divide-y divide-gray-900/5">
        {skateparks.map((skatepark) => (
          <div
            key={skatepark.name}
            className="flex items-center justify-between py-3"
          >
            <div className="flex items-center space-x-4">
              {/* <Image
                src={user.image}
                alt={user.name}
                width={48}
                height={48}
                className="rounded-full ring-1 ring-gray-900/5"
              /> */}
              <div className="space-y-1">
                <p className="font-medium leading-none">{skatepark.name}</p>
                <p className="text-sm text-gray-500">{skatepark.email}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">{skatepark.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
