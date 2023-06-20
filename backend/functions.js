import "query-string";
import fetch from "node-fetch";
export const login = async (client_id, client_secret) => {
  const res = await fetch(
    "https://accounts.spotify.com/authorize?" +
      queryString.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        client_secret: client_secret,
        redirect_uri: "127.0.0.1:8001/",
        state: state,
      })
  );
};

export const refreshToken = async (refresh_token, client_id, client_secret) => {
  // requesting access token from refresh token
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        new Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    },
    json: true,
  };
  const res = await fetch(authOptions.url, {
    headers: authOptions.headers,
    method: "POST",
    body: `grant_type=${authOptions.form.grant_type}&refresh_token=${refresh_token}`,
  });
  const newToken = res.json();
  return newToken;
};

export const getAuth = async (code, client_id, client_secret) => {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        new Buffer.from(`${client_id}:${client_secret}`).toString("base64"),
    },
    body: `grant_type=authorization_code&code=${code}&redirect_uri=http%3A%2F%2Flocalhost%3A8001`,
    json: true,
  });
  var token = await res.json();

  if (res.status != 200) {
  }
  return token;
};

export const getTrack = async (trackId, token) => {
  const res = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: {
      Authorization: `Bearer ${token.access_token}`,
    },
  });
  const track = await res.json();
  return track;
};

export const search = async (query, token) => {
  query = encodeURI(query);
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=track`,
    {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    }
  );
  if (res.error) {
    console.error(res.error);
    return res.error;
  }
  const tracks = await res.json();
  return tracks;
};

export const getPlaylist = async (id, token) => {
  const res = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
    headers: {
      Authorization: `Bearer ${token.access_token}`,
    },
  });
  const playlist = await res.json();
  return playlist;
};

export const tracksToUriList = (tracks) => {
  for (let i in tracks) {
    tracks[i] = tracks[i].items.uri;
  }
};

export const addSongsToPlaylist = async (id, tracks, unique = true, token) => {
  if (unique) {
    const playlist = await (
      await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      })
    ).json();

    for (let i in playlist.items) {
      if (playlist.items[i].track && playlist.items[i].track.uri == tracks[0]) {
        return;
      }
    }
  }
  const res = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
    method: "POST",
    body: JSON.stringify({
      uris: tracks,
    }),
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      "Content-Type": "application/json",
    },
  });
  return;
};
