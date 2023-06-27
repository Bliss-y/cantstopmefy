import { Router } from "express";
import queryString from "query-string";
import fs from "fs";
const api = Router();
import { addSongsToPlaylist, getAuth, search } from "../functions.js";
import "query-string";

api.get("/test", async (req, res) => {
  await addSongsToPlaylist(
    "4PiHhy2PEpbbV2yEqA3TSG",
    ["spotify:track:6rqhFgbbKwnb9MLmUQDhG6"],
    true,
    req.token
  );
  res.send({ status: "ok" });
});

api.get("/addToPlaylist", async (req, res) => {
  console.log(req.query.title);
  console.log(req.token);
  await addSongsToPlaylist(
    "4PiHhy2PEpbbV2yEqA3TSG",
    [(await search(req.query.title, req.token)).tracks.items[0].uri],
    true,
    req.token
  );
  res.json({ status: "ok" });
});
export default api;

api.get("/message", async (req, res) => {
  console.log(req.query.message);
  res.json({ message: "ok" });
});
