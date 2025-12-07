import { getCurrentUserServer } from '@/lib/auth-server';
import prisma from '@/lib/prisma';
import PostCard from '@/components/PostCard';
import CommentSection from '@/components/CommentSection';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import RightSidebar from '@/components/RightSidebar';

export default async function PostDetailPage({ params }) {
    const { id } = await params;
    const currentUser = await getCurrentUserServer();

    if (!currentUser) {
        redirect('/login');
    }

    const post = await prisma.post.findUnique({
        where: { id: parseInt(id) },
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
                where: { userId: currentUser.id },
                select: { userId: true },
            },
        },
    });

    if (!post) {
        notFound();
    }

    // Fetch all comments for the post
    const allComments = await prisma.comment.findMany({
        where: {
            postId: parseInt(id),
        },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: { createdAt: 'asc' },
    });

    // Build comment tree
    const commentMap = {};
    const rootComments = [];

    // Initialize map
    allComments.forEach(comment => {
        comment.children = [];
        commentMap[comment.id] = comment;
    });

    // Link children to parents
    allComments.forEach(comment => {
        if (comment.parentId) {
            if (commentMap[comment.parentId]) {
                commentMap[comment.parentId].children.push(comment);
            }
        } else {
            rootComments.push(comment);
        }
    });

    // Sort root comments by newest first
    rootComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <div className="min-h-screen flex max-w-7xl mx-auto">
            <aside className="w-20 xl:w-64 border-r border-border sticky top-0 h-screen">
                <Sidebar user={currentUser} />
            </aside>

            <main className="flex-1 border-r border-border min-h-screen">
                <div>
                    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border p-4">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="p-2 hover:bg-secondary rounded-full transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <h1 className="text-xl font-bold">Post</h1>
                        </div>
                    </div>

                    <PostCard post={post} currentUser={currentUser} isDetail={true} />

                    <div className="border-t border-border p-4">
                        <CommentSection postId={post.id} comments={rootComments} currentUser={currentUser} />
                    </div>
                </div>
            </main>

            <aside className="hidden lg:block w-80 xl:w-96 sticky top-0 h-screen">
                <RightSidebar />
            </aside>
        </div>
    );
}
