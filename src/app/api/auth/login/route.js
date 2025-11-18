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

    
    const user = await prisma.user.findUnique({where:{email}})

    if(!user){
      return NextResponse.json({message:"User does not exists"},{status:400})
      }

    const checkPass = await bcrypt.compare(password,user.password)
    if(!checkPass){
      return NextResponse.json({message:"invalid cred"},{status:400})
    }
    const token = await generateToken({name:user.name,email})

    return NextResponse.json({message:"logged in",token},{status:200})
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

