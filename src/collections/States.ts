import type { CollectionConfig } from 'payload'

export const States: CollectionConfig = {
  slug: 'states',
  defaultSort: 'name',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['code', 'name', 'fips'],
    pagination: {
      defaultLimit: 50,           
      limits: [10, 25, 50, 100],  
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      maxLength: 2,
      index: true,
      admin: {
        description: '2-letter state abbreviation (e.g. CA)',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Full name of the state (e.g. California)',
      },
    },
    {
      name: 'fips',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'FIPS code for the state (e.g. 06)',
      },
    },
  ],
}
