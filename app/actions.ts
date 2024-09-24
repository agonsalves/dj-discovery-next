'use server'

export async function fetchAccessToken(code: string, redirectUri: string) {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
        }),
    });

    const data = await response.json();

    if (response.ok) {
        return data.access_token;
    } else {
        return { error: data.error };
    }
}

export async function fetchUserPlaylists(accessToken: string, url = 'https://api.spotify.com/v1/me/playlists?limit=50') {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();

    if (response.ok) {
        let playlists = data.items;

        if (data.next) {
            const nextPlaylists = await fetchUserPlaylists(accessToken, data.next);
            playlists = playlists.concat(nextPlaylists);
        }

        return playlists;
    } else {
        return { error: data.error };
    }
}

export async function fetchPlaylistDetails(accessToken: string, id: string) {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    const data = await response.json();

    if (response.ok) {
        return data;
    } else {
        return { error: data.error };
    }
}

export async function fetchPlaylistTracks(accessToken: string, id: string, offset = 0, limit = 100) {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks?offset=${offset}&limit=${limit}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    const data = await response.json();

    if (response.ok) {
        return data;
    } else {
        return { error: data.error };
    }
}
export async function fetchUserProfile(accessToken: string) {
    const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    const data = await response.json();

    if (response.ok) {
        return data;
    } else {
        return { error: data.error };
    }
}