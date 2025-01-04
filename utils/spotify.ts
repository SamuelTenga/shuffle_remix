import { existsSync } from "$std/fs/exists.ts";

export async function getSavedTracks(access_token: string) {
  if(existsSync("./fixtures/saved_tracks.json")){
    console.log("Using fixture fetch");
    const data = Deno.readTextFileSync("./fixtures/saved_tracks.json");
    return JSON.parse(data);
  }
  console.log("Using fetch");
  let allTracks = [] as any[];
  let offset = 0;
  const limit = 50;
  while (true) {
    const res = await fetch(`https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }).then((res) => res.json());
    console.log(res);
    
    allTracks = [...allTracks, ...res.items];
    if (res.items.length < limit) {
      break;
    }
    offset += limit;
  }
  console.log(allTracks.length);
  Deno.writeTextFileSync("./fixtures/saved_tracks.json", JSON.stringify(allTracks));
  return allTracks;
}

export async function addTrackIfNotAlreadyQueuedAsFirst(access_token: string, track_uri: string) {
  const res = await fetch("https://api.spotify.com/v1/me/player/queue", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }).then((res) => res.json());
  
  if (res.queue.length < 1 || res.queue[0].uri !== track_uri) {
    await addTrackToQueue(access_token, track_uri);
    console.log("Track added to queue");
  } else {
    console.log("Track already queued");  
  }
}
  

async function addTrackToQueue(access_token: string, track_uri: string) {
  await fetch("https://api.spotify.com/v1/me/player/queue?uri=" + track_uri, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
}






