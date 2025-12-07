'use client';

import { Home, User, Search, LogOut, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar({ user }) {
    const router = useRouter();
    const [showSearch, setShowSearch] = useState(false);
    const [search, setSearch] = useState('');

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            router.push(`/?search=${encodeURIComponent(search)}`);
            setShowSearch(false);
        }
    };

    return (
        <nav className="sticky top-0 z-50 glass border-b border-border/50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-pink-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold gradient-text hidden sm:block">Vibe</span>
                    </Link>

                    {/* Center Navigation */}
                    <div className="flex items-center gap-2">
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/50 transition-all font-medium"
                        >
                            <Home className="w-5 h-5" />
                            <span className="hidden md:inline">Home</span>
                        </Link>
                        <button
                            onClick={() => setShowSearch(!showSearch)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/50 transition-all font-medium"
                        >
                            <Search className="w-5 h-5" />
                            <span className="hidden md:inline">Search</span>
                        </button>
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/profile"
                            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/50 transition-all"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-pink-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
                                {user.name?.[0]?.toUpperCase()}
                            </div>
                            <span className="hidden lg:inline font-medium">{user.name}</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Search Bar (Expandable) */}
                {showSearch && (
                    <div className="pb-4">
                        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search posts, people, topics..."
                                className="w-full px-6 py-3 pl-12 rounded-2xl bg-white/70 border-2 border-primary/20 focus:border-primary outline-none transition-all"
                                autoFocus
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        </form>
                    </div>
                )}
            </div>
        </nav>
    );
}
