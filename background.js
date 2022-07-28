const SOURCE_URLS = ['go.microsoft.com/fwlink', 'msn.com']
const DESTINATION_URL = 'https://youtube.com'
const ERROR_CANNOT_EDITED = 'Error: Tabs cannot be edited right now (user may be dragging a tab).'

chrome.tabs.onCreated.addListener(tabOnCreated);
chrome.tabs.onUpdated.addListener(tabOnUpdated);

chrome.tabs.onRemoved.removeListener(tabOnCreated);
chrome.tabs.onRemoved.removeListener(tabOnUpdated);

async function redirectTo(tab, sourceUrls, destinationUrl) {
  length = sourceUrls.length

  for(let i = 0; i < length; i++){
    if (tab.url?.includes(sourceUrls[i])) {
      await chrome.tabs.update(tab.id, { url: destinationUrl });
    }
  }
}

async function tabOnCreated(tab) {
  try {
    await redirectTo(tab, SOURCE_URLS, DESTINATION_URL)
  } catch (error) {
    if (error == ERROR_CANNOT_EDITED) {
      setTimeout(() => tabOnCreated(tab), 50);
    } else {
      console.error(error);
    }
  }
}

async function tabOnUpdated(tabId, changeInfo, tab) {
  try {
    await redirectTo(tab, SOURCE_URLS, DESTINATION_URL)
  } catch (error) {
    if (error == ERROR_CANNOT_EDITED) {
      setTimeout(() => tabOnUpdated(tabId, changeInfo, tab), 50);
    } else {
      console.error(error);
    }
  }
}
