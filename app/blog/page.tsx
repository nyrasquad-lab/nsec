import { supabase } from '@/lib/supabase';
import type { Post } from '@/lib/types';
import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';

async function getPosts() {
  const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
  return (data || []) as Post[];
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="container py-20">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">IT Insights Blog</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Expert insights on IT infrastructure, cloud computing, and cybersecurity
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center text-muted-foreground">
          <p>No articles published yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md"
            >
              {post.image_url && (
                <div className="aspect-video overflow-hidden bg-muted">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6">
                <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {post.category}
                </span>
                <h2 className="mb-2 text-xl font-semibold group-hover:text-primary">{post.title}</h2>
                <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {post.published_at}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {post.read_time}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
