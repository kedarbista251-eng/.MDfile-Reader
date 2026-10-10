// Background service worker for LightMD extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('LightMD Markdown Reader extension installed successfully.');
});

// Listener for messages from popup to open reader in full tab
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'OPEN_FULL_TAB') {
    chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
    sendResponse({ success: true });
  }
});
