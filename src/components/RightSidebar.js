'use client';

import { Search, X, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

export default function RightSidebar() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const searchPosts = async () => {
            if (!search.trim()) {
                setResults([]);
                setShowResults(false);
                return;
            }

            setLoading(true);
            setShowResults(true);

            try {
                const response = await fetch(`/api/posts?search=${encodeURIComponent(search)}&limit=5`);
                if (response.ok) {
                    const data = await response.json();
                    setResults(data.posts || []);
                }
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(searchPosts, 300);
        return () => clearTimeout(debounceTimer);
    }, [search]);

    const handleClear = () => {
        setSearch('');
        setResults([]);
        setShowResults(false);
    };

    const handlePostClick = (postId) => {
        router.push(`/posts/${postId}`);
        setShowResults(false);
        setSearch('');
    };

    return (
        <div className="h-full p-6 overflow-y-auto">
            {/* Search Section */}
            <div className="relative mb-6">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search posts..."
                        className="block w-full pl-12 pr-10 py-3.5 border-2 border-border rounded-2xl bg-card text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all shadow-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onFocus={() => search.trim() && setShowResults(true)}
                    />
                    {search && (
                        <button
                            onClick={handleClear}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>

                {/* Search Results Dropdown - Fixed z-index */}
                {showResults && (
                    <div className="absolute top-full left-0 right-0 mt-3 bg-card border-2 border-border rounded-2xl shadow-2xl max-h-[500px] overflow-y-auto z-[100]">
                        {loading ? (
                            <div className="p-6 text-center">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                                <p className="mt-3 text-muted-foreground text-sm">Searching...</p>
                            </div>
                        ) : results.length > 0 ? (
                            <div className="divide-y divide-border">
                                {results.map((post) => (
                                    <div
                                        key={post.id}
                                        onClick={() => handlePostClick(post.id)}
                                        className="p-4 hover:bg-secondary cursor-pointer transition-all group"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex-shrink-0 flex items-center justify-center font-bold text-white text-sm shadow-md">
                                                {post.author.name?.[0]?.toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
                                                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                                        {post.author.name}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                                                </div>
                                                <p className="text-sm text-foreground line-clamp-2 mb-2">{post.content}</p>
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <span className="font-medium">{post._count?.comments || 0}</span> comments
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <span className="font-medium">{post._count?.likes || 0}</span> likes
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-secondary flex items-center justify-center">
                                    <Search className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <p className="text-muted-foreground font-medium">No posts found</p>
                                <p className="text-sm text-muted-foreground mt-1">Try searching for something else</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Trending Section - Only show when NOT searching */}
            {!showResults && (
                <div className="bg-gradient-to-br from-card to-secondary rounded-2xl p-5 shadow-md border border-border">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <h2 className="font-bold text-lg gradient-text">Trending Now</h2>
                    </div>
                    <p className="text-muted-foreground text-sm">Discover what's popular in your community</p>
                    <div className="mt-4 space-y-3">
                        <div className="p-3 bg-background/50 rounded-xl">
                            <p className="text-xs text-muted-foreground mb-1">Coming soon</p>
                            <p className="text-sm font-medium">Trending topics will appear here</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
