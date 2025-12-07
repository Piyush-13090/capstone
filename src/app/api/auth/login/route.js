import { NextResponse } from 'next/server';
import { verifyPassword } from '@/lib/users';
import prisma from '@/lib/prisma';
import { generateToken } from '@/lib/jwt';
import bcrypt from "bcrypt"

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }


    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json({ message: "User does not exists" }, { status: 400 })
    }

    const checkPass = await bcrypt.compare(password, user.password)
    if (!checkPass) {
      return NextResponse.json({ message: "invalid cred" }, { status: 400 })
    }
    const token = await generateToken({ id: user.id, name: user.name, email })

    const response = NextResponse.json({ message: "logged in", token }, { status: 200 })
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    return response
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

