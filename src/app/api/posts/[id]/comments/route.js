import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const comments = await prisma.comment.findMany({
            where: {
                postId: parseInt(id),
                parentId: null, // Fetch top-level comments
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                children: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                        children: {
                            include: {
                                author: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                    },
                                },
                            }
                        }
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request, { params }) {
    try {
        const token = request.cookies.get('token')?.value;
        if (!token) {
            console.log('No token found in cookies');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            console.log('Invalid token');
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const { id } = await params;
        const { content, parentId } = await request.json();

        console.log('Creating comment:', { postId: id, content, parentId, userEmail: decoded.email });

        if (!content) {
            return NextResponse.json(
                { error: 'Content is required' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: decoded.email },
        });

        if (!user) {
            console.log('User not found:', decoded.email);
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                postId: parseInt(id),
                authorId: user.id,
                parentId: parentId ? parseInt(parentId) : null,
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
        });

        console.log('Comment created successfully:', comment.id);
        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        console.error('Error creating comment:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
