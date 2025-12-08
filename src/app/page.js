import { getCurrentUserServer } from '@/lib/auth-server';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import CreatePost from '@/components/CreatePost';
import PostCard from '@/components/PostCard';
import Navbar from '@/components/Navbar';

export default async function HomePage({ searchParams }) {
  const user = await getCurrentUserServer();

  if (!user) {
    redirect('/login');
  }

  const params = await searchParams;
  const sort = params?.sort || 'newest';
  const search = params?.search || '';

  console.log('Search params:', { sort, search });

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar user={user} />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <HomeContent user={user} sort={sort} search={search} />
      </main>
    </div>
  );
}

async function HomeContent({ user, sort, search }) {
  const prisma = (await import('@/lib/prisma')).default;

  let orderBy = {};
  if (sort === 'newest') {
    orderBy = { createdAt: 'desc' };
  } else if (sort === 'oldest') {
    orderBy = { createdAt: 'asc' };
  } else if (sort === 'most_commented') {
    orderBy = { comments: { _count: 'desc' } };
  }

  const where = search
    ? {
      OR: [
        { content: { contains: search } },
        { author: { name: { contains: search } } },
        { comments: { some: { content: { contains: search } } } },
      ],
    }
    : {};

  const posts = await prisma.post.findMany({
    where,
    orderBy,
    take: 50,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: { comments: true, likes: true },
      },
      likes: {
        where: { userId: user.id },
        select: { userId: true },
      },
    },
  });

  return (
    <>
      {/* Sort Tabs */}
      <div className="glass rounded-2xl p-1.5 mb-6 flex gap-1.5 shadow-md">
        <a
          href="/?sort=newest"
          className={`flex-1 text-center py-3.5 px-4 font-semibold rounded-xl transition-all duration-200 ${sort === 'newest'
            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
            : 'text-muted-foreground hover:bg-blue-50 hover:text-blue-600'
            }`}
        >
          <span className="flex items-center justify-center gap-2">
            <span>🔥</span>
            <span>Latest</span>
          </span>
        </a>
        <a
          href="/?sort=oldest"
          className={`flex-1 text-center py-3.5 px-4 font-semibold rounded-xl transition-all duration-200 ${sort === 'oldest'
            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
            : 'text-muted-foreground hover:bg-blue-50 hover:text-blue-600'
            }`}
        >
          <span className="flex items-center justify-center gap-2">
            <span>⏰</span>
            <span>Oldest</span>
          </span>
        </a>
        <a
          href="/?sort=most_commented"
          className={`flex-1 text-center py-3.5 px-4 font-semibold rounded-xl transition-all duration-200 ${sort === 'most_commented'
            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
            : 'text-muted-foreground hover:bg-blue-50 hover:text-blue-600'
            }`}
        >
          <span className="flex items-center justify-center gap-2">
            <span>💬</span>
            <span>Popular</span>
          </span>
        </a>
      </div>

      <CreatePost user={user} />

      <div className="space-y-6 mt-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} currentUser={user} />
        ))}
        {posts.length === 0 && (
          <div className="glass rounded-3xl p-16 text-center shadow-lg">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3 gradient-text">No posts yet</h3>
            <p className="text-muted-foreground text-lg">Be the first to share something amazing!</p>
          </div>
        )}
      </div>
    </>
  );
}
