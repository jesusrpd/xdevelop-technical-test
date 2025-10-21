import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

export const config = {
    matcher: ['/dashboard', '/users', '/books', '/posts']
}

export async function middleware(request: NextRequest) {

    const access_token = request.cookies.get("access_token")?.value

    if(!access_token) return NextResponse.redirect(new URL('/', request.url))

    NextResponse.next()
}
