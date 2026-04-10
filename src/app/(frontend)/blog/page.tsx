import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'

import config from '@payload-config'

export const metadata: Metadata = {
  title: 'Blog',
}

export default async function BlogPage() {
  const payload = await getPayload({ config: await config })

  const { docs: posts } = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    sort: '-createdAt',
    limit: 20,
    depth: 1,
    overrideAccess: false,
  })

  return (
    <div className="blog-list">
      <h1>Blog</h1>
      {posts.length === 0 && <p>No posts published yet.</p>}
      <ul className="blog-list__posts">
        {posts.map((post) => {
          const banner =
            post.bannerImage && typeof post.bannerImage === 'object' ? post.bannerImage : null

          return (
            <li key={post.id} className="blog-list__item">
              <Link href={`/blog/${post.slug}`}>
                {banner?.url && (
                  <Image
                    src={banner.url}
                    alt={banner.alt ?? post.title}
                    width={banner.width ?? 800}
                    height={banner.height ?? 400}
                  />
                )}
                <h2>{post.title}</h2>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
