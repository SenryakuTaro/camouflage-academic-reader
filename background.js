'use strict';

// ============================================================
//  Background Service Worker
//  Handles the Ctrl+Shift+L keyboard shortcut command.
// ============================================================

chrome.commands.onCommand.addListener(async command => {
  if (command !== 'toggle-academic-mode') return;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;

  // Try to send toggle message; if it fails, inject the content script first
  function sendToggle() {
    return new Promise(resolve => {
      chrome.tabs.sendMessage(tab.id, { action: 'toggle' }, response => {
        if (chrome.runtime.lastError) resolve(null);
        else resolve(response);
      });
    });
  }

  let res = await sendToggle();

  if (res === null) {
    // Content script not yet active on this tab — inject it dynamically
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js'],
      });
      await chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ['academic.css'],
      });
      res = await sendToggle();
    } catch (err) {
      console.error('[CAR] Failed to inject scripts:', err);
    }
  }

  // Update the extension badge to show current state
  if (res?.academicMode) {
    chrome.action.setBadgeText({ text: 'ON', tabId: tab.id });
    chrome.action.setBadgeBackgroundColor({ color: '#1a237e', tabId: tab.id });
  } else {
    chrome.action.setBadgeText({ text: '', tabId: tab.id });
  }
});

// Clear badge when tab navigates away (mode resets on page load)
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'loading') {
    chrome.action.setBadgeText({ text: '', tabId });
  }
});
