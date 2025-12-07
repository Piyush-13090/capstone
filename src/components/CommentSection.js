'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Trash2, Edit2, CornerDownRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

function Comment({ comment, currentUser, postId, depth = 0 }) {
    const router = useRouter();
    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [editContent, setEditContent] = useState(comment.content);
    const [loading, setLoading] = useState(false);

    const isAuthor = currentUser?.email === comment.author.email;

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: replyContent, parentId: comment.id }),
            });

            if (response.ok) {
                setReplyContent('');
                setIsReplying(false);
                router.refresh();
            }
        } catch (error) {
            console.error('Failed to reply:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`/api/comments/${comment.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: editContent }),
            });

            if (response.ok) {
                setIsEditing(false);
                router.refresh();
            }
        } catch (error) {
            console.error('Failed to update comment:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Delete this comment?')) return;
        try {
            const response = await fetch(`/api/comments/${comment.id}`, {
                method: 'DELETE',
            });
            if (response.ok) router.refresh();
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    return (
        <div className={cn("py-3", depth > 0 && "ml-8 border-l-2 border-border pl-4")}>
            <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center font-bold text-sm">
                    {comment.author.name?.[0]?.toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="font-bold">{comment.author.name}</span>
                            <span className="text-muted-foreground">
                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </span>
                        </div>

                        {isAuthor && (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <Edit2 className="w-3 h-3" />
                                    Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-3 h-3" />
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleUpdate} className="mt-2">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full p-2 bg-secondary rounded-md text-sm"
                                rows={2}
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                <button type="button" onClick={() => setIsEditing(false)} className="text-xs">Cancel</button>
                                <button type="submit" disabled={loading} className="text-xs bg-primary text-white px-2 py-1 rounded">Save</button>
                            </div>
                        </form>
                    ) : (
                        <p className="text-sm mt-1">{comment.content}</p>
                    )}

                    <div className="mt-2">
                        <button
                            onClick={() => setIsReplying(!isReplying)}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                        >
                            <MessageCircle className="w-3 h-3" />
                            Reply
                        </button>
                    </div>

                    {isReplying && (
                        <form onSubmit={handleReply} className="mt-3">
                            <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Write a reply..."
                                className="w-full p-2 bg-secondary rounded-md text-sm"
                                rows={2}
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                <button type="button" onClick={() => setIsReplying(false)} className="text-xs">Cancel</button>
                                <button type="submit" disabled={loading} className="text-xs bg-primary text-white px-2 py-1 rounded">Reply</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {comment.children?.length > 0 && (
                <div className="mt-2">
                    {comment.children.map((child) => (
                        <Comment
                            key={child.id}
                            comment={child}
                            currentUser={currentUser}
                            postId={postId}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function CommentSection({ postId, comments, currentUser }) {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        setError('');
        try {
            const response = await fetch(`/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });

            const data = await response.json();

            if (response.ok) {
                setContent('');
                router.refresh();
            } else {
                setError(data.error || 'Failed to post comment');
                console.error('Comment error:', data);
            }
        } catch (error) {
            console.error('Failed to post comment:', error);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-4">
            <h3 className="font-bold text-lg mb-4">Comments</h3>

            {currentUser ? (
                <form onSubmit={handleSubmit} className="mb-6 flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center font-bold text-sm">
                        {currentUser.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Post your reply"
                            className="w-full p-3 bg-secondary rounded-xl resize-none focus:ring-2 focus:ring-primary outline-none"
                            rows={2}
                        />
                        {error && (
                            <p className="text-red-500 text-sm mt-1">{error}</p>
                        )}
                        <div className="flex justify-end mt-3">
                            <button
                                type="submit"
                                disabled={!content.trim() || loading}
                                className="px-6 py-2 bg-blue-500 text-white font-bold rounded-full text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? 'Posting...' : 'Post Comment'}
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="mb-6 p-4 bg-secondary rounded-xl text-center">
                    <p className="text-muted-foreground">Please log in to post a comment.</p>
                </div>
            )}

            <div className="space-y-4">
                {comments.map((comment) => (
                    <Comment
                        key={comment.id}
                        comment={comment}
                        currentUser={currentUser}
                        postId={postId}
                    />
                ))}
            </div>
        </div>
    );
}
