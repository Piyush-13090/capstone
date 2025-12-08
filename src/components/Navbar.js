'use client';

import { Home, User, Search, LogOut, Sparkles } from 'lucide-react';
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
        <nav className="sticky top-0 z-50 glass border-b border-border/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                                <Sparkles className="w-6 h-6 text-white" strokeWidth={2.5} />
                            </div>
                            <div className="absolute -inset-1 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl opacity-20 blur-md group-hover:opacity-30 transition-opacity"></div>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent hidden sm:block">
                            Nexus
                        </span>
                    </Link>

                    {/* Center Navigation */}
                    <div className="flex items-center gap-1">
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-blue-50 transition-all font-medium text-foreground/80 hover:text-blue-600"
                        >
                            <Home className="w-5 h-5" strokeWidth={2} />
                            <span className="hidden md:inline">Home</span>
                        </Link>
                        <button
                            onClick={() => setShowSearch(!showSearch)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-blue-50 transition-all font-medium text-foreground/80 hover:text-blue-600"
                        >
                            <Search className="w-5 h-5" strokeWidth={2} />
                            <span className="hidden md:inline">Search</span>
                        </button>
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center gap-2">
                        <Link
                            href="/profile"
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-blue-50 transition-all group"
                        >
                            <div className="relative">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-white text-sm shadow-md group-hover:shadow-lg transition-all">
                                    {user.name?.[0]?.toUpperCase()}
                                </div>
                            </div>
                            <span className="hidden lg:inline font-semibold text-foreground/80 group-hover:text-blue-600 transition-colors">
                                {user.name}
                            </span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="p-2.5 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all text-foreground/60"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" strokeWidth={2} />
                        </button>
                    </div>
                </div>

                {/* Search Bar (Expandable) */}
                {showSearch && (
                    <div className="pb-4 animate-in slide-in-from-top-2 duration-200">
                        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search posts, people, topics..."
                                className="w-full px-6 py-3.5 pl-12 rounded-2xl bg-white border-2 border-blue-200 focus:border-blue-500 outline-none transition-all shadow-sm focus:shadow-md font-medium placeholder:text-muted-foreground"
                                autoFocus
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" strokeWidth={2} />
                        </form>
                    </div>
                )}
            </div>
        </nav>
    );
}
