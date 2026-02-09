/**
 * CLI: Seed the States collection with 50 US states + DC.
 * Run after a fresh dev start (push creates schema, this seeds data):
 *   pnpm run seed:states
 * Idempotent: skips if any states already exist.
 */
import 'dotenv/config'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { seedStates } from '@/seed/states'

async function main(): Promise<void> {
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.find({
    collection: 'states',
    limit: 1,
  })
  if (totalDocs > 0) {
    console.log('States already seeded, skipping.')
    return
  }
  await seedStates(payload)
  console.log('Seeded 51 states (50 states + DC).')
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })