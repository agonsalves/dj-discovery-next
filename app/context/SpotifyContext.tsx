'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { fetchUserPlaylists, fetchUserProfile } from '@/app/actions';

interface SpotifyTokenContextProps {
    accessToken: string | null;
    playlists: any[] | null;
    userProfile: any | null;
}

const SpotifyContext = createContext<SpotifyTokenContextProps | undefined>(undefined);

export const SpotifyTokenProvider = ({ children }: { children: ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [playlists, setPlaylists] = useState<any[] | null>(null);
    const [userProfile, setUserProfile] = useState<any | null>(null);

    useEffect(() => {
        const getPlaylists = async (token: string) => {
            const playlistsData = await fetchUserPlaylists(token);
            if (!playlistsData.error) {
                setPlaylists(playlistsData);
            } else {
                console.error('Failed to fetch playlists:', playlistsData.error);
            }
        }

        const getUserProfile = async (token: string) => {
            const profileData = await fetchUserProfile(token);
            if (!profileData.error) {
                setUserProfile(profileData);
            } else {
                console.error('Failed to fetch user profile:', profileData.error);
            }
        }

        const storedToken = localStorage.getItem('access_token');
        if (storedToken) {
            setAccessToken(storedToken);
        } else {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('access_token');

            if (token) {
                setAccessToken(token);
                localStorage.setItem('access_token', token);
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }

        if (accessToken) {
            getPlaylists(accessToken);
            getUserProfile(accessToken);
        }
    }, [accessToken]);

    return (
        <SpotifyContext.Provider value={{ accessToken, playlists, userProfile }}>
            {children}
        </SpotifyContext.Provider>
    );
};

export const useSpotify = () => {
    const context = useContext(SpotifyContext);
    if (context === undefined) {
        throw new Error('useSpotifyToken must be used within a SpotifyTokenProvider');
    }
    return context;
};