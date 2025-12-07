'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, LogOut, Twitter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function Sidebar({ user }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const navItems = [
        { icon: Home, label: 'Home', href: '/' },
        { icon: User, label: 'Profile', href: '/profile' },
    ];

    return (
        <div className="flex flex-col h-full p-4">
            <div className="mb-8">
                <Link href="/" className="flex items-center gap-2 text-primary">
                    <Twitter className="w-8 h-8 fill-current" />
                </Link>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-4 p-3 rounded-full text-xl transition-colors',
                                isActive
                                    ? 'font-bold text-primary bg-primary/10'
                                    : 'hover:bg-secondary'
                            )}
                        >
                            <Icon className="w-7 h-7" />
                            <span className="hidden xl:inline">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {user && (
                <div className="mt-auto">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 p-3 w-full rounded-full text-xl hover:bg-red-50 text-red-600 transition-colors"
                    >
                        <LogOut className="w-7 h-7" />
                        <span className="hidden xl:inline">Logout</span>
                    </button>

                    <div className="flex items-center gap-3 mt-4 p-3 rounded-full hover:bg-secondary cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-lg">
                            {user.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="hidden xl:block overflow-hidden">
                            <p className="font-bold truncate">{user.name}</p>
                            <p className="text-sm text-muted-foreground truncate">@{user.email.split('@')[0]}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
