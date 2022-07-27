const SOURCE_URL = 'msn.com'
const DESTINATION_URL = 'https://youtube.com'
const ERROR_CANNOT_EDITED = 'Error: Tabs cannot be edited right now (user may be dragging a tab).'

chrome.tabs.onCreated.addListener(redirectMSNOnCreated);
chrome.tabs.onUpdated.addListener(redirectMSNOnUpdated);

chrome.tabs.onRemoved.removeListener(redirectMSNOnCreated);
chrome.tabs.onRemoved.removeListener(redirectMSNOnUpdated);

async function redirectTo(tab, sourceUrl, destinationUrl) {
  if (tab.url?.includes(sourceUrl)) {
    await chrome.tabs.update(tab.id, { url: destinationUrl });
  }
}

async function redirectMSNOnCreated(tab) {
  try {
    await redirectTo(tab, SOURCE_URL, DESTINATION_URL)
  } catch (error) {
    if (error == ERROR_CANNOT_EDITED) {
      setTimeout(() => redirectMSNOnCreated(tab), 50);
    } else {
      console.error(error);
    }
  }
}

async function redirectMSNOnUpdated(tabId, changeInfo, tab) {
  try {
    await redirectTo(tab, SOURCE_URL, DESTINATION_URL)
  } catch (error) {
    if (error == ERROR_CANNOT_EDITED) {
      setTimeout(() => redirectMSNOnUpdated(tabId, changeInfo, tab), 50);
    } else {
      console.error(error);
    }
  }
}
