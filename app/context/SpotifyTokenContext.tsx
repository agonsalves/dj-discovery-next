'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { fetchUserPlaylists } from '@/app/actions';

interface SpotifyTokenContextProps {
    accessToken: string | null;
    playlists: any[] | null;
}

const SpotifyTokenContext = createContext<SpotifyTokenContextProps | undefined>(undefined);

export const SpotifyTokenProvider = ({ children }: { children: ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [playlists, setPlaylists] = useState<any[] | null>(null);

    useEffect(() => {
        const getPlaylists = async (token: string) => {
            const playlistsData = await fetchUserPlaylists(token);
            if (!playlistsData.error) {
                setPlaylists(playlistsData);
            } else {
                console.error('Failed to fetch playlists:', playlistsData.error);
            }
        }

        if (accessToken) {
            getPlaylists(accessToken);
        } else {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('access_token');

            if (token) {
                setAccessToken(token);
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }
    }, [accessToken]);

    return (
        <SpotifyTokenContext.Provider value={{ accessToken, playlists }}>
            {children}
        </SpotifyTokenContext.Provider>
    );
};

export const useSpotifyToken = () => {
    const context = useContext(SpotifyTokenContext);
    if (context === undefined) {
        throw new Error('useSpotifyToken must be used within a SpotifyTokenProvider');
    }
    return context;
};