'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Heart, Share2, MoreHorizontal, Trash2, Edit2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function PostCard({ post, currentUser, isDetail = false }) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.content);
    const [loading, setLoading] = useState(false);
    const [isLiked, setIsLiked] = useState(post.likes?.length > 0);
    const [likesCount, setLikesCount] = useState(post._count?.likes || 0);

    const handleLike = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Optimistic update
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1);

        try {
            const response = await fetch(`/api/posts/${post.id}/like`, {
                method: 'POST',
            });

            if (!response.ok) {
                // Revert on failure
                setIsLiked(!newIsLiked);
                setLikesCount(prev => !newIsLiked ? prev + 1 : prev - 1);
            }
        } catch (error) {
            console.error('Failed to toggle like:', error);
            // Revert on failure
            setIsLiked(!newIsLiked);
            setLikesCount(prev => !newIsLiked ? prev + 1 : prev - 1);
        }
    };

    const isAuthor = currentUser?.email === post.author.email;

    const handleDelete = async (e) => {
        e.preventDefault();
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            const response = await fetch(`/api/posts/${post.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                if (isDetail) {
                    router.push('/');
                } else {
                    router.refresh();
                }
            }
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`/api/posts/${post.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: editContent }),
            });

            if (response.ok) {
                setIsEditing(false);
                router.refresh();
            }
        } catch (error) {
            console.error('Failed to update post:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cn(
            "glass rounded-2xl overflow-hidden transition-all card-lift bg-white",
            !isDetail && "cursor-pointer",
            isDetail && "shadow-xl"
        )} onClick={() => !isDetail && !isEditing && router.push(`/posts/${post.id}`)}>
            <div className="p-6">
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex-shrink-0 flex items-center justify-center font-bold text-white text-lg shadow-md">
                        {post.author.name?.[0]?.toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm">
                                <span className="font-bold hover:underline text-foreground" onClick={(e) => e.stopPropagation()}>
                                    {post.author.name}
                                </span>
                                <span className="text-muted-foreground">@{post.author.email.split('@')[0]}</span>
                                <span className="text-muted-foreground">·</span>
                                <span className="text-muted-foreground hover:underline">
                                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                                </span>
                            </div>

                            {isAuthor && (
                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors font-medium"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleUpdate} onClick={(e) => e.stopPropagation()} className="mt-3">
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="w-full p-3 bg-secondary/50 border border-border rounded-xl resize-none focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                                    rows={3}
                                />
                                <div className="flex justify-end gap-2 mt-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 text-sm font-semibold hover:bg-secondary rounded-xl transition-colors text-muted-foreground"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <p className="mt-1 text-base whitespace-pre-wrap">{post.content}</p>

                                {/* Media Display */}
                                {post.mediaUrl && (
                                    <div className="mt-4 rounded-xl overflow-hidden border-2 border-border/50">
                                        {post.mediaType === 'image' ? (
                                            <img
                                                src={post.mediaUrl}
                                                alt="Post media"
                                                className="w-full max-h-[500px] object-cover cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.open(post.mediaUrl, '_blank');
                                                }}
                                            />
                                        ) : post.mediaType === 'video' ? (
                                            <video
                                                src={post.mediaUrl}
                                                controls
                                                className="w-full max-h-[500px]"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        ) : null}
                                    </div>
                                )}
                            </>
                        )}

                        <div className="flex justify-between mt-4 max-w-md text-muted-foreground">
                            <button className="flex items-center gap-2 group transition-colors hover:text-primary">
                                <div className="p-2 rounded-xl group-hover:bg-primary/10 transition-colors">
                                    <MessageCircle className="w-5 h-5" strokeWidth={2} />
                                </div>
                                <span className="text-sm font-semibold">{post._count?.comments || 0}</span>
                            </button>
                            <button
                                onClick={handleLike}
                                className={cn(
                                    "flex items-center gap-2 group transition-colors",
                                    isLiked ? "text-red-500" : "hover:text-red-500"
                                )}
                            >
                                <div className={cn(
                                    "p-2 rounded-xl group-hover:bg-red-500/10 transition-colors",
                                    isLiked && "bg-red-500/10"
                                )}>
                                    <Heart className={cn("w-5 h-5", isLiked && "fill-current")} strokeWidth={2} />
                                </div>
                                <span className="text-sm font-semibold">{likesCount}</span>
                            </button>
                            <button className="flex items-center gap-2 group transition-colors hover:text-green-500">
                                <div className="p-2 rounded-xl group-hover:bg-green-500/10 transition-colors">
                                    <Share2 className="w-5 h-5" strokeWidth={2} />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
