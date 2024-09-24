'use client'

import Link from 'next/link';
import { useSpotify } from './context/SpotifyContext';

export default function Home() {
    const { accessToken, playlists, userProfile } = useSpotify();

    if (!playlists || !userProfile) {
        return <p>Loading...</p>;
    }
    const userPlaylists = playlists.filter(playlist => playlist.owner.id === userProfile.id);

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <h1>Spotify Access Token</h1>
                {accessToken ? (
                    <>
                        <p>{accessToken}</p>
                        <h2>User Playlists</h2>
                        {userPlaylists ? (
                            <ul>
                                {userPlaylists.map((playlist: any) => (
                                    <li key={playlist.id}>
                                        <Link href={`/playlist/${playlist.id}`}>
                                            {playlist.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Fetching playlists...</p>
                        )}
                    </>
                ) : (
                    <Link href="/login">Login</Link>
                )}
            </main>
        </div>
    );
}