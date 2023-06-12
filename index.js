import fetch from "node-fetch";
import dotenv from "dotenv";
import queryString from "query-string";
import fs from "fs";
import express, { json } from "express";
import { Router } from "express";
import { encode } from "punycode";
const app = express();

dotenv.config();
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const access_token = "";
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

const refreshToken = async (refresh_token) => {
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
  console.log(res);
  const newToken = res.json();
  return newToken;
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
    console.log("getAuthError:");
    console.log(token);
  }
  console.log("token");
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
  query = encodeURI(query);
  console.log(query);
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

  console.log(tracks.tracks.items[0]);
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

const addSongsToPlaylist = async (id, tracks, unique = true) => {
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

// getPlaylist("8d459e9cb093758b9c7153599379aa10");

// getPlaylist("36jAPizJWlN4PlILRsp6Mq");
const route = Router();

route.get("/test", async (req, res) => {
  await addSongsToPlaylist("4PiHhy2PEpbbV2yEqA3TSG", [
    (await search("stuck in the sound let's go")).tracks.items[0].uri,
  ]);
  return;
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
  var code = req.query.code || null;
  if (!code) return res.redirect("/login");
  token = await getAuth(code);
  fs.writeFile(
    "config.json",
    JSON.stringify({ code: code, token: token }),
    "utf-8",
    async (err, data) => {
      if (err) console.log(err);
      res.send("<a href='/test'>Test</a>");
      return;
    }
  );
});

app.use("/", async (req, res, next) => {
  if (req.path === "/" || req.path === "/login") return next();
  var code;
  fs.readFile("config.JSON", "utf-8", async (err, data) => {
    if (err) {
      console.log("error reading file!");
      redirect("localhost:8001/login");
    } else {
      code = JSON.parse(data).token.refresh_token;
      token = await refreshToken(code);
      if (!token.refresh_token) token.refresh_token = code;
      console.log(token);
      if (token.error) {
        console.log("error Occurred", token);
        res.redirect("/login");
        return;
      }
      fs.writeFile(
        "config.json",
        JSON.stringify({ code: code, token: token }),
        "utf-8",
        async (err, data) => {
          if (err) console.log(err);
          res.send("<a href='/test'>Test</a>");
        }
      );
      next();
    }
  });
});

app.use("/", route);
app.listen(8001, () => {});
