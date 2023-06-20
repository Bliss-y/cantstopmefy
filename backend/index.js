import fetch from "node-fetch";
import dotenv from "dotenv";
import queryString from "query-string";
import { promises } from "fs";
import express, { json } from "express";
import { Router } from "express";
const app = express();
import route from "./routes/routes.js";
import * as functions from "./functions.js";
import api from "./routes/api.js";
dotenv.config();
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const access_token = "";

var token;
const scope = "playlist-modify-private playlist-modify-public";
app.use("/api/", async (req, res, next) => {
  var code;
  console.log("HERE");
  const data = await promises.readFile("config.json");

  code = JSON.parse(data).token.refresh_token;
  token = await functions.refreshToken(code, client_id, client_secret, token);
  if (!token.refresh_token) token.refresh_token = code;
  if (token.error) {
    console.log("error Occurred", token);
    res.redirect("/login");
    return;
  }
  const jsondata = JSON.stringify({ code: code, token: token });
  await promises.writeFile("config.json", jsondata);
  req.token = token;
  next();
  return;
});

app.use("/api/", api);
app.use("/", (req, _, next) => {
  req.client_id = client_id;
  req.client_secret = client_secret;
  next();
});
app.use("/", route);
app.listen(8001, () => {});
