import { Router } from "express";
import queryString from "query-string";
import fs from "fs";
const route = Router();
import { addSongsToPlaylist, getAuth, search } from "../functions.js";
import "query-string";
const scope = "playlist-modify-private playlist-modify-public";
var state = "WqZuWSpofmud4SMn";

route.get("/login", async (req, res) => {
  console.log(req.client_id);
  return res.redirect(
    "https://accounts.spotify.com/authorize?" +
      queryString.stringify({
        response_type: "code",
        client_id: req.client_id,
        scope: scope,
        client_secret: req.client_secret,
        redirect_uri: "http://localhost:8001",
        state: state,
      })
  );
});

route.get("/", async (req, res) => {
  var code = req.query.code || null;
  if (!code) return res.redirect("/login");
  const token = await getAuth(code, req.client_id, req.client_secret);
  fs.writeFile(
    "config.json",
    JSON.stringify({ code: code, token: token }),
    "utf-8",
    async (err, data) => {
      if (err) console.log(err);
      res.json({ res: token });
      return;
    }
  );
});

route.get("/default", async (req, res) => {
  res.send(`
<h1>If this is your first time Then Login : )</h1>
<a href="/login">Login</a>
  `);
});
export default route;
