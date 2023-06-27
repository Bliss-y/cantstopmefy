const information = async () => {
  const inforTab = document.getElementById("info");
  let tabs = await chrome.storage.local.get("recorded_tabs");
  let text = JSON.stringify(tabs.recording_tabs);
  await chrome.storage.local.set({ recording_tabs: [] });

  tabs = await chrome.storage.local.get("recorded_tabs");
  console.log(JSON.stringify(tabs));
  inforTab.innerText += text;
};
information();
//////////
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

const startRecording = async () => {
  chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    let recordingTabs = (await chrome.storage.local.get("recording_tabs")) || {
      recording_tabs: [],
    };
    if (!recordingTabs.recording_tabs) {
      recordingTabs.recordingTabs = [];
      chrome.storage.local.set({ recording_tabs: [] });
    }
    if (recordingTabs.recording_tabs.includes(tabId)) {
      await addTabSong("hello");
    }
  });
};

const removeRecording = async (tabId) => {
  let recordingTabs = await chrome.storage.local.get("recording_tabs");
  if (
    recordingTabs.recording_tabs &&
    recordingTabs.recording_tabs.includes(tabId)
  ) {
    recordingTabs.recording_tabs.splice(recordingTabs.indexOf(tabId), 1);
    chrome.storage.local.set({
      recording_tabs: recordingTabs.recording_tabs,
    });
  }
};

// chrome.tabs.onUpdated.addEventListener("");

const addTabSong = async (title) => {
  title = title.replace(" - YouTube", "");
  title = encodeURI(title);
  console.log("here");
  fetch("http://localhost:8001/api/message?title=" + title);
};

startRecording();

const setRecording = async () => {
  const tab = await chrome.tabs.query({ active: true, currentWindow: true });
  const tabId = tab[0].id;
  let recording_tabs = (await chrome.storage.local.get("recording_tabs")) || {
    recording_tabs: [],
  };
  if (!recording_tabs || !recording_tabs.recording_tabs) {
    recording_tabs.recording_tabs = [];
    chrome.storage.local.set({ recording_tabs: [] });
  }
  if (!recording_tabs.recording_tabs.includes(tabId))
    recording_tabs.recording_tabs.push(tabId);
  await chrome.storage.local.set({
    recording_tabs: recording_tabs.recording_tabs,
  });
  console.log("recording:" + recording_tabs);
};

const recbtn = document.getElementById("rec-btn");
recbtn.addEventListener("click", async () => {
  await setRecording();
});
