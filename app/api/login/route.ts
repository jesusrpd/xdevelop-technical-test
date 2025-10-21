import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const {token} = await req.json()

    if(!token) return NextResponse.json({error: "Credenciales invalidas"}, {status: 401})

    const res = NextResponse.json({ success: true })
    res.cookies.set("access_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60*15 //15min
    }) 
    res.cookies.set("refresh_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 días
    })
    return res
}