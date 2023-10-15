import { connectSpotify, searchSong } from "@/utils/spotify";

export async function POST(request: Request) {
    const { term } = await request.json();
    console.log({ term });

    if (!term) {
        return new Response('Missing search term', { status: 400 });
    }

    const accessToken = await connectSpotify();
    const searchResult = await searchSong(term, accessToken);

    if (!searchResult) {
        return new Response('Not found', { status: 404 });
    }

    return Response.json({
        results: searchResult.slice(0, 10),
    })
}