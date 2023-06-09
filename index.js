import fetch from "node-fetch";
import dotenv from 'dotenv' 
dotenv.config();
let client_id = process.env.CLIENT_ID
let client_secret =  process.env.CLIENT_SECRET
console.log(client_id)
const getAuth = async()=>{
const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST', 
    headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    },
    body:`grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`

} );
var token = await res.json();
return token;
}
const token = {
  access_token: 'BQDzJtCe1ZzxFSt7q3p4L-9ubgRVEE_Dkc0n-UiA4BsoIFoRel631mEbv0OvkxZp8_Hlbirivtry1HERiFQdzxGZPQ8Ex6M_WI79bsUxpvvbABO4LVQ',
  token_type: 'Bearer',
  expires_in: 3600
}
const getTrack = async(trackId)=> {
    const res = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {headers:{
        'Authorization': `Bearer ${token.access_token}`
    }})
    const track = await res.json(); 
    console.log(track);
    return track;
}

const search = async(query)=> {
    const res = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`, {headers:{
    'Authorization': `Bearer ${token.access_token}`}}
)
    if(res.error) {
        console.error(res.error);
        return res.error;
    }
    const tracks = await res.json();
    // console.log(tracks);
    return tracks;
}

const getPlaylist = async ( id )=>{
    const res = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {headers:{
    'Authorization': `Bearer ${token.access_token}`}}
)
const playlist = await res.json()
console.log(playlist)
return playlist;
}

const tracks = await search('unsainted')
getPlaylist('36jAPizJWlN4PlILRsp6Mq')