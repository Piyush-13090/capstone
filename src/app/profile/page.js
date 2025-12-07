import { getCurrentUserServer } from '@/lib/auth-server';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import RightSidebar from '@/components/RightSidebar';
import ProfilePageContent from '@/components/ProfilePageContent';

export default async function ProfilePage() {
    const user = await getCurrentUserServer();

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen flex max-w-7xl mx-auto">
            <aside className="w-20 xl:w-64 border-r border-border sticky top-0 h-screen">
                <Sidebar user={user} />
            </aside>

            <main className="flex-1 border-r border-border min-h-screen">
                <ProfilePageContent />
            </main>

            <aside className="hidden lg:block w-80 xl:w-96 sticky top-0 h-screen">
                <RightSidebar />
            </aside>
        </div>
    );
}
