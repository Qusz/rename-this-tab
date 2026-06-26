chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "renameCurrentTab",
    title: "Rename this tab",
    contexts: ["page"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "renameCurrentTab") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: promptAndRenameTab,
    });
  }
});

function promptAndRenameTab() {
  let originalTitle = sessionStorage.getItem("ext_original_tab_title");

  if (!originalTitle) {
    originalTitle = document.title;
    sessionStorage.setItem("ext_original_tab_title", originalTitle);
  }

  const newTitle = prompt(
    "Enter a new name (leave empty to restore original):",
    document.title,
  );

  if (newTitle === null) {
    return;
  }

  if (newTitle.trim() === "") {
    document.title = originalTitle;

    sessionStorage.removeItem("ext_original_tab_title");
  } else {
    document.title = newTitle.trim();
  }
}
