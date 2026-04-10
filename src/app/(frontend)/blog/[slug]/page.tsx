import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'

import config from '@payload-config'

type Args = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    limit: 1000,
    select: { slug: true },
    overrideAccess: false,
  })

  return docs.map((post) => ({ slug: post.slug ?? '' })).filter((p) => p.slug)
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })

  const post = docs[0]
  if (!post) return {}

  return {
    title: post.title,
  }
}

export default async function BlogPostPage({ params }: Args) {
  const { slug } = await params
  const { isEnabled: isDraftMode } = await draftMode()
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
    draft: isDraftMode,
    overrideAccess: isDraftMode,
  })

  const post = docs[0]
  if (!post) notFound()

  const bannerImage =
    post.bannerImage && typeof post.bannerImage === 'object' ? post.bannerImage : null

  return (
    <article className="blog-post">
      {bannerImage?.url && (
        <div className="blog-post__banner">
          <Image
            src={bannerImage.url}
            alt={bannerImage.alt ?? post.title}
            width={bannerImage.width ?? 1600}
            height={bannerImage.height ?? 800}
            priority
          />
        </div>
      )}
      <div className="blog-post__body">
        <h1>{post.title}</h1>
        {post.content && <RichText data={post.content} />}
      </div>
    </article>
  )
}
