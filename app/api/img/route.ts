import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get('url')
    if (!url) return new NextResponse('missing url', { status: 400 })

    const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
    })

    const buffer = await res.arrayBuffer()
    return new NextResponse(buffer, {
        headers: {
            'Content-Type': res.headers.get('Content-Type') || 'image/png',
            'Cache-Control': 'public, max-age=86400',
        },
    })
}