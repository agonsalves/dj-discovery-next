'use client'

import { useEffect, useState } from 'react';
import { fetchPlaylist } from '@/app/actions';
import { useSpotifyToken } from '@/app/context/SpotifyTokenContext';

export default function PlaylistDetails({params}: {params: {id: string}}) {
    const { id } = params;
    const { accessToken } = useSpotifyToken();
    const [playlist, setPlaylist] = useState<any>(null);

    useEffect(() => {
        const fetchPlaylistDetails = async () => {
            if (id && accessToken) {
                try {
                    const data = await fetchPlaylist(accessToken, id as string);
                    setPlaylist(data);
                } catch (error) {
                    console.error('Failed to fetch playlist details:', error);
                }
            }
        };

        fetchPlaylistDetails();
    }, [id, accessToken]);

    if (!playlist) {
        return <p>Loading...</p>;
    }

    console.log(playlist)

    return (
        <div>
            <h1>{playlist.name}</h1>
            <p>{playlist.description}</p>
            <ul>
                {playlist.tracks.items.map((track: any) => (
                    <li key={track.track.id}>{track.track.name}</li>
                ))}
            </ul>
        </div>
    );
}