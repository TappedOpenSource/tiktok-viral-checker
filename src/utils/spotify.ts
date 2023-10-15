import { Song } from "@/types/song";
import { Track } from "@/types/track";


const clientId = process.env.SPOTIFY_CLIENT_ID ?? "";
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET ?? "";
const playlistIDs = process.env.SPOTIFY_PLAYLIST_IDS?.split(",") ?? [];

export async function connectSpotify(): Promise<string> {
    const base64Auth = Buffer.from(
        clientId + ":" + clientSecret
    ).toString("base64");

    const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            'Authorization':
                "Basic " + base64Auth,
            'Content-Type': "application/x-www-form-urlencoded",
        },
        body: `grant_type=client_credentials`,
    });

    if (res.status !== 200) {
        throw new Error(`Failed to connect to Spotify: ${res.statusText}`);
    }

    const { access_token } = await res.json();

    return access_token;
}

export function refreshConnection() {
    setInterval(() => {
        connectSpotify();
    }, 3500000)
}

export async function searchSong(song: string, accessToken: string) {
    //console.log(viralPlaylists)
    let query = encodeURIComponent(song);

    const url = `https://api.spotify.com/v1/search?q=track%3A${query}&type=track&include_external=true`;

    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
    });


    const json = await res.json();
    const tracks: Track[] = await json.tracks.items;
    return tracks.map((track) => {
        return {
            name: track.name,
            artist: track.artists[0].name,
            id: track.id
        }
    })
    //out = checkDuplicates(out)
};

export async function checkViral(playlists: Song[], id: string | string[]) {
    let out = false;
    const temp = playlists.map((e: Song) => e.id);

    if (Array.isArray(id)) {
        id.forEach(item => {
            //console.log(item)
            if (temp.includes(item)) {
                out = true;
                //console.log("MATCH")
            }
        })
    } else {
        //console.log('one arg')
        playlists.forEach((song: Song) => {
            if (song.id == id) {
                // song is viral
                //console.log("MATCH")
                out = true;
            }
        })
    }
    //console.log(viralPlaylists);
    return out;
}

export async function getPlaylist(accessToken: string): Promise<Song[]> {
    // for each playlist in playlistIDs
    const outputs = await Promise.all(
        playlistIDs.map(async (playlistID) => {
            const urlPlaylist = `https://api.spotify.com/v1/playlists/${playlistID}`;

            const res = await fetch(urlPlaylist, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
            })

            const { tracks } = await res.json();
            const songs: Song[] = tracks.items;

            console.log({ songs });
            return songs;
        }),
    );

    const flat = outputs.flat(1);

    // make request to spotify API
    // const url = 'https://api.spotify.com/v1/tracks/2TpxZ7JUBn3uw46aR7qd6V';
    // const url2 = "https://api.spotify.com/v1/search?q=track%3ARoxanne&type=track&include_external=true";
    // const oldUrl = 'https://api.spotify.com/v1/search?q=tiktok';
    //console.log(res.data.tracks.items[0].track.name + " " + res.data.tracks.items[0].track.id)

    return flat;
};