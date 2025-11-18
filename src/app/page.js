"use client"

import Image from "next/image";
import Link from "next/link";
import UserInfo from "@/components/UserInfo";
import { useEffect, useState } from "react";
import { Island_Moments } from "next/font/google";

export default function Home() {
  const [isLoggedIn, setisLoggedIn] = useState(false)

  useEffect(()=>{
    const checktoken = async ()=>{
      let token = localStorage.getItem("token")
      if(!token){
        await setisLoggedIn(false)
      }else{
        await setisLoggedIn(true)
      }
    }

    checktoken()
  },[])
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="w-full flex justify-between items-center mb-8">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
          <UserInfo />
        </div>
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Authentication Demo
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            This is a simple authentication system built with Next.js, JWT, and bcrypt.
            Sign up or log in to get started.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <Link
            href="/signup"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-purple-600 px-5 text-white transition-colors hover:bg-purple-700 md:w-[158px]"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-purple-600 px-5 text-purple-600 transition-colors hover:bg-purple-50 dark:hover:bg-purple-900/20 md:w-[158px]"
          >
            Login
          </Link>

          {
            isLoggedIn && <button className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-purple-600 px-5 text-purple-600 transition-colors hover:bg-purple-50 dark:hover:bg-purple-900/20 md:w-[158px]" onClick={()=>{
              localStorage.removeItem("token")
              setisLoggedIn(false)
            }}>Logout</button>
          }
        </div>
      </main>
    </div>
  );
}
