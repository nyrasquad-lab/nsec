import { supabase } from '@/lib/supabase';
import type { Post } from '@/lib/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

async function getPost(slug: string) {
  const { data } = await supabase.from('posts').select('*').eq('slug', slug).maybeSingle();
  return data as Post | null;
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <article className="container max-w-3xl py-20">
      <Link href="/blog" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Blog
      </Link>

      <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
        {post.category}
      </span>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{post.title}</h1>
      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {post.published_at}</span>
        <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {post.read_time}</span>
      </div>

      {post.image_url && (
        <div className="mt-8 aspect-video overflow-hidden rounded-xl bg-muted">
          <img src={post.image_url} alt={post.title} className="h-full w-full object-cover" />
        </div>
      )}

      <div className="mt-8 prose prose-lg max-w-none text-foreground">
        <p className="text-lg text-muted-foreground">{post.excerpt}</p>
      </div>
    </article>
  );
}
