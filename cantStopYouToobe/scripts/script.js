const addSong = async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // tabs[0].url; //url
    var title = tabs[0].title; //title
    title = title.replace(" - YouTube", "");
    title = encodeURI(title);
    console.log("here");
    fetch("http://localhost:8001/api/addToplaylist/?title=" + title);
  });
};
var menu;
chrome.runtime.onInstalled.addListener(function () {
  menu = chrome.contextMenus.create(
    {
      title: "hello",
      id: "addsong",
      onclick: addSong,
    },
    () => {}
  );
});

const btn = document.getElementById("add-btn");
if (btn) {
  btn.addEventListener("click", async () => {
    btn.innerText = "Adding....";
    await addSong();
    btn.innerText = "Add";
  });
}

const sleep = (ms = 2000) => {
  return new Promise((r) => setTimeout(r, ms));
};
