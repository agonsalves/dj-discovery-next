'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { fetchUserPlaylists, fetchUserProfile } from '@/app/actions';

interface SpotifyContextProps {
    accessToken: string | null;
    playlists: any[] | null;
    userProfile: any | null;
}

const SpotifyContext = createContext<SpotifyContextProps | undefined>(undefined);

export const SpotifyProvider = ({ children }: { children: ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [playlists, setPlaylists] = useState<any[] | null>(null);
    const [userProfile, setUserProfile] = useState<any | null>(null);
    useEffect(() => {
        const handle401Error = () => {
            localStorage.removeItem('access_token');
            setAccessToken(null);
            window.location = '/login';
        };

        const getPlaylists = async (token: string) => {
            const playlistsData = await fetchUserPlaylists(token);
            if (playlistsData.error) {
                if (playlistsData.error.status === 401) {
                    handle401Error();
                } else {
                    console.error('Failed to fetch playlists:', playlistsData.error);
                }
            } else {
                setPlaylists(playlistsData);
            }
        };

        const getUserProfile = async (token: string) => {
            const profileData = await fetchUserProfile(token);
            if (profileData.error) {
                if (profileData.error.status === 401) {
                    handle401Error();
                } else {
                    console.error('Failed to fetch user profile:', profileData.error);
                }
            } else {
                setUserProfile(profileData);
            }
        };

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
        throw new Error('useSpotify must be used within a SpotifyProvider');
    }
    return context;
};