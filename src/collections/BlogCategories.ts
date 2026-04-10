import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

export const BlogCategories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    slugField({ fieldToUse: 'name' }),
  ],
  timestamps: true,
}
