import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import prisma from '@/lib/prisma';

export async function getCurrentUserServer() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded) return null;

    try {
        const user = await prisma.user.findUnique({
            where: { email: decoded.email },
            select: {
                id: true,
                name: true,
                email: true,
                bio: true,
            },
        });
        return user;
    } catch (error) {
        return null;
    }
}
