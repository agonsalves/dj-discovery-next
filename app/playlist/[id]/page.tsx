'use client'

import { useEffect, useState } from 'react';
import { fetchPlaylistDetails, fetchPlaylistTracks } from '@/app/actions';
import { useSpotify } from '@/app/context/SpotifyContext';

export default function PlaylistDetails({ params }: { params: { id: string } }) {
    const { id } = params;
    const { accessToken } = useSpotify();
    const [playlist, setPlaylist] = useState<any>(null);
    const [tracks, setTracks] = useState<any[]>([]);

    useEffect(() => {
        const fetchAllTracks = async (token: string, playlistId: string, offset = 0) => {
            try {
                const data = await fetchPlaylistTracks(token, playlistId, offset);
                setTracks(prevTracks => [...prevTracks, ...data.items]);

                if (data.next) {
                    await fetchAllTracks(token, playlistId, offset + data.limit);
                }
            } catch (error) {
                console.error('Failed to fetch playlist tracks:', error);
            }
        };

        const fetchDetails = async (token: string, playlistId: string) => {
            try {
                const data = await fetchPlaylistDetails(token, playlistId);
                setPlaylist(data);
            } catch (error) {
                console.error('Failed to fetch playlist details:', error);
            }
        };

        if (id && accessToken) {
            fetchDetails(accessToken, id);
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