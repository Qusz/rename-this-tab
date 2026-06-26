chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "renameCurrentTab",
      title: "Rename this tab",
      contexts: ["page"],
    });
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "renameCurrentTab") {
    try {
      await chrome.scripting.executeScript({
        target: {
          tabId: tab.id,
          frameIds: [0]
        },
        func: promptAndRenameTab,
      });
    } catch (error) {
      console.error("Failed to rename tab:", error.message);
    }
  }
});

function promptAndRenameTab() {
  const STORAGE_KEY = "ext_original_tab_title";

  let originalTitle = sessionStorage.getItem(STORAGE_KEY);
  if (!originalTitle) {
    originalTitle = document.title;
    sessionStorage.setItem(STORAGE_KEY, originalTitle);
  }

  const newTitle = prompt(
      "Enter a new name (leave empty to restore original):",
      document.title
  );

  if (newTitle === null) {
    return;
  }

  if (newTitle.trim() === "") {
    document.title = originalTitle;
    sessionStorage.removeItem(STORAGE_KEY);
  } else {
    document.title = newTitle.trim();
  }
}