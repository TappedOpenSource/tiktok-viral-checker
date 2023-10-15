import { checkViral, connectSpotify, getPlaylist } from "@/utils/spotify";
import { get } from "http";

export async function POST(request: Request) {
  const { id, term } = await request.json();

  console.log({ id, term });

  const accessToken = await connectSpotify();
  const playlists = await getPlaylist(accessToken);
  if (id !== undefined && id !== null) {
    const isViral = await checkViral(playlists, id);
    return Response.json({
      is_viral: isViral,
    })
  }

  const data = decodeURIComponent(term);
  // convert to array
  const idArr = data.split(',')
  idArr.forEach((item, index) => {
    idArr[index] = item.replace(/[^a-z0-9]/gi, '')
  })
  //console.log(idArr);
  const isViral = await checkViral(playlists, idArr);

  return Response.json({
    is_viral: isViral,
  })
}