import jwt from "jsonwebtoken"

import bcrypt from "bcrypt"
import { NextResponse } from 'next/server';
import { createUser } from '@/lib/users';
import prisma from '@/lib/prisma';
import { generateToken } from '@/lib/jwt';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (user) {
      return NextResponse.json({ message: "User exists" }, { status: 400 })
    }

    const hashedPass = await bcrypt.hash(password, 10)

    const createdUser = await prisma.user.create({
      data: {
        name, email, password: hashedPass
      }
    })

    const token = await generateToken({ id: createdUser.id, name, email })

    const response = NextResponse.json({ message: "Use signedup succesffully", token }, { status: 201 })
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    return response

  } catch (error) {
    if (error.message === 'User already exists') {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

