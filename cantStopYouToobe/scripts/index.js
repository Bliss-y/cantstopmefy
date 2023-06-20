// addSong();

const sleep = (ms = 2000) => {
  return new Promise((r) => setTimeout(r, ms));
};

const addSong = async () => {
  var title = document.title;
  title = title.replace(" - YouTube", "");
  title = encodeURI(title);
  await fetch("http://localhost:8001/api/addToplaylist/?title=" + title, {
    mode: "no-cors",
  });
};

console.log("HERE");

const element = document.createElement("div");
element.innerText = "S";
element.style.position = "sticky";
element.style.margin = "auto";
element.style.width = "max-content";
element.style.height = "50px";
element.style.zIndex = "100000";
element.id = "spotify-btn";
const wrapper = document.createElement("div");
element.addEventListener("click", async () => {
  element.innerText = "";
  element.classList.add("lds-dual-ring");
  element.style.cursor = "progress";
  await addSong();
  element.classList.remove("lds-dual-ring");
  element.innerHTML = "✓";
  await sleep(500);
  element.style.cursor = "pointer";
  element.innerText = "S";
});

wrapper.style.position = "relative";
wrapper.appendChild(element);
document.body.prepend(wrapper);

// chrome.contextMenus.create(
//   {
//     type: "hello",
//   },
//   () => {
//     addSong;
//   }
// );
