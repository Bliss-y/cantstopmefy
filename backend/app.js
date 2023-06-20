import fetch from 'node-fetch'

const main = async()=>{const response = await fetch('https://httpbin.org/post', {method: 'POST', body: 'a=1'});
const data = response.json();

console.log(data);
}

main();