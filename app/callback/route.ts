'use server'

import { NextRequest, NextResponse } from 'next/server'
import { redirect } from 'next/navigation'
import { fetchAccessToken } from '@/app/actions'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code || !state) {
        return NextResponse.json({ error: 'Missing code or state' }, { status: 400 });
    }

    const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
    const accessToken = await fetchAccessToken(code, redirectUri);

    if (accessToken && !accessToken.error) {
        return redirect(`/?access_token=${accessToken}`);
    } else {
        return NextResponse.json({ error: accessToken.error }, { status: 400 });
    }
}