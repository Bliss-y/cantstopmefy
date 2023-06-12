const addSong = async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // tabs[0].url; //url
    var title = tabs[0].title; //title
    title = title.replace(" - YouTube", "");
    title = encodeURI(title);
    console.log("here");
    fetch("http://localhost:8001/addToplaylist/?title=" + title);
  });
};

const btn = document.getElementById("add-btn");
console.log(btn);
btn.addEventListener("click", () => {
  addSong();
});
