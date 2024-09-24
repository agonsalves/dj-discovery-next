'use client'

import { useEffect, useState } from 'react';
import { fetchPlaylist } from '@/app/actions';
import { useSpotifyToken } from '@/app/context/SpotifyTokenContext';

export default function PlaylistDetails({ params }: { params: { id: string } }) {
    const { id } = params;
    const { accessToken } = useSpotifyToken();
    const [playlist, setPlaylist] = useState<any>(null);
    const [tracks, setTracks] = useState<any[]>([]);

    useEffect(() => {
        const fetchAllTracks = async (token: string, playlistId: string, offset = 0) => {
            try {
                const data = await fetchPlaylist(token, playlistId, offset);
                setTracks(prevTracks => [...prevTracks, ...data.items]);

                if (data.next) {
                    await fetchAllTracks(token, playlistId, offset + data.limit);
                } else {
                    setPlaylist(data);
                }
            } catch (error) {
                console.error('Failed to fetch playlist details:', error);
            }
        };

        if (id && accessToken) {
            fetchAllTracks(accessToken, id);
        }
    }, [id, accessToken]);

    if (!playlist) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>{playlist.name}</h1>
            <p>{playlist.description}</p>
            <ul>
                {tracks.map((track: any) => (
                    <li key={track.track.id}>{track.track.name}</li>
                ))}
            </ul>
        </div>
    );
}