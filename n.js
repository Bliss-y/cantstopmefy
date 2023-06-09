const getAuth = async () => {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        new Buffer.from(`${client_id}:${client_secret}`).toString("base64"),
    },
    body: `redirect_url=http%3A%2F%2Flocalhost%3A8001`,
    json: true,
  });
  if (res.status != 200) {
    console.log(res);
  }
  var token = await res.json();

  return token;
};
