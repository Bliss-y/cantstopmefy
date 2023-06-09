import fetch from "node-fetch";
import dotenv from "dotenv";
import queryString from "query-string";
dotenv.config();
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

import express, { json } from "express";
import { Router } from "express";
const app = express();
const code = "";
// import { Express } from "express";
const access_token = code;
//   "AQArKn2l0LcDbWCFIM4AnfrHIhoIztUf2R2XoXe1vWAy-L-9gf_EJAhyai5Y348mIUhyvyTl_xhrLfwxaOPnDmzCIzY_7d96ANwwuFxKmeCU3CPwhAaQC73egeUh09n1l6l4vgcuXagLS339DQNgwtlveurueh2OOzJAe33wZz10mKFeteFIOf-9ABeGACWws9RtFGsAgiHjMHULvxCdyJ-vroCjZ0tHdqk";

const scope = "playlist-modify-private playlist-modify-public";
var state = "WqZuWSpofmud4SMn";

const login = async () => {
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

const getAuth = async (code) => {
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
    console.log(token);
  }
  return token;
};

var token;

const getTrack = async (trackId) => {
  const res = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: {
      Authorization: `Bearer ${token.access_token}`,
    },
  });
  const track = await res.json();
  console.log(track);
  return track;
};

const search = async (query) => {
  console.log(token);
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
  console.log(tracks);
  return tracks;
};

const getPlaylist = async (id) => {
  const res = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
    headers: {
      Authorization: `Bearer ${token.access_token}`,
    },
  });
  console.log(token);
  const playlist = await res.json();
  console.log(playlist);
  return playlist;
};

const addSongsToPlaylist = async (id, tracks) => {
  console.log(tracks);
  const res = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
    method: "POST",
    body: JSON.stringify({
      uris: ["spotify:track:5mpUKTdskZea0gStWzeHUZ"],
    }),
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      "Content-Type": "application/json",
    },
  });
  console.log(await res.json());
};

// getPlaylist("8d459e9cb093758b9c7153599379aa10");

// getPlaylist("36jAPizJWlN4PlILRsp6Mq");
const route = Router();
route.get("/test", async (req, res) => {
  await addSongsToPlaylist("4PiHhy2PEpbbV2yEqA3TSG", [
    (await search("unsainted")).tracks.items[0].uri,
  ]);
  res.send("hi");
});

route.get("/login", async (req, res) => {
  return res.redirect(
    "https://accounts.spotify.com/authorize?" +
      queryString.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        client_secret: client_secret,
        redirect_uri: "http://localhost:8001",
        state: state,
      })
  );
});

route.get("/", async (req, res) => {
  var code = req.query.code;
  console.log(code);
  token = await getAuth(code);
  res.send("<a href='/test'>Test</a>");
});

app.use("/", route);
app.listen(8001, () => {});

// https://open.spotify.com/playlist/4PiHhy2PEpbbV2yEqA3TSG?si=f526644540184ab7&pt=8d459e9cb093758b9c7153599379aa10
// https://open.spotify.com/playlist/36jAPizJWlN4PlILRsp6Mq?si=2d9d1855c0de4872

// const res = await fetch(
//   `https://api.spotify.com/v1/playlists/${"4PiHhy2PEpbbV2yEqA3TSG"}/tracks`,
//   {
//     method: "POST",
//     body: {
//       uris: ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh"],
//       position: 0,
//     },
//     headers: {
//       Authorization: `Bearer ${token.access_token}`,
//       "Content-Type": "application/json",
//     },
//   }
// );
// console.log(res);
