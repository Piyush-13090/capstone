Next.js JWT Auth Starter

A lightweight authentication starter built with Next.js (App Router), Prisma, PostgreSQL, JWT, and bcrypt. Includes signup/login pages, token handling, and a simple Tailwind UI.

🚀 Features

Next.js 16 + React 19

Secure auth with bcrypt + JWT

Prisma ORM with PostgreSQL

Auth routes: /signup, /login, /logout, /me

Tokens stored in localStorage (can be switched to HTTP-only cookies)

Clean UI with Tailwind CSS 4

📁 Structure
src/
  app/
    login/, signup/, api/auth/...
  components/
  lib/
prisma/
  schema.prisma

⚙️ Setup

1. Install

git clone <repo> project
cd project
npm install


2. Environment
Create .env:

DATABASE_URL="postgres://USER:PASS@HOST:PORT/db"
JWT_SECRET="your-secret"


3. Prisma

npx prisma migrate dev
npx prisma generate


4. Run

npm run dev


Visit: http://localhost:3000

🔌 API Overview
Endpoint	Method	Description
/api/auth/signup	POST	Create user & return JWT
/api/auth/login	POST	Login & return JWT
/api/auth/logout	POST	Clear token cookie
/api/auth/me	GET	Return current user
🧩 Next Steps

Switch /me to Prisma (remove file-based store)

Add route protection middleware

Use HTTP-only cookies for better security
