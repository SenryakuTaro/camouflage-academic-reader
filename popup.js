'use strict';

const mainToggle   = document.getElementById('mainToggle');
const statusText   = document.getElementById('statusText');
const badge        = document.getElementById('statusBadge');
const tooltipCheck = document.getElementById('tooltipToggle');

function updateUI(isActive, style, showTooltip) {
  mainToggle.checked = isActive;
  const label = style === 'newspaper' ? 'Newspaper' : 'Academic Paper';
  statusText.textContent = isActive ? `Mode: ON — ${label}` : 'Mode: OFF';
  badge.className = 'status-badge' + (isActive ? ' on' : '');

  const radio = document.querySelector(`input[name="readerStyle"][value="${style}"]`);
  if (radio) radio.checked = true;

  tooltipCheck.checked = showTooltip !== false;
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

function sendToTab(tab, action, extra = {}) {
  return new Promise(resolve => {
    chrome.tabs.sendMessage(tab.id, { action, ...extra }, response => {
      resolve(chrome.runtime.lastError ? null : response);
    });
  });
}

function getSettings() {
  return new Promise(resolve =>
    chrome.storage.local.get(['readerStyle', 'showTooltip'], resolve)
  );
}

// ── Init popup ──
(async () => {
  const tab = await getActiveTab();
  const [response, settings] = await Promise.all([
    tab ? sendToTab(tab, 'getState') : Promise.resolve(null),
    getSettings(),
  ]);
  const style       = settings.readerStyle  || 'academic';
  const showTooltip = settings.showTooltip  !== false;
  updateUI(response?.academicMode || false, style, showTooltip);
})();

// ── Main mode toggle ──
mainToggle.addEventListener('change', async () => {
  const tab = await getActiveTab();
  if (!tab) return;

  let response = await sendToTab(tab, 'toggle');

  if (response === null) {
    try {
      await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
      await chrome.scripting.insertCSS({ target: { tabId: tab.id }, files: ['academic.css'] });
      response = await sendToTab(tab, 'toggle');
    } catch (err) {
      console.error('Failed to inject content script:', err);
      mainToggle.checked = !mainToggle.checked;
      return;
    }
  }

  const settings = await getSettings();
  updateUI(response?.academicMode || false, settings.readerStyle || 'academic', settings.showTooltip !== false);
});

// ── Layout style change ──
document.querySelectorAll('input[name="readerStyle"]').forEach(radio => {
  radio.addEventListener('change', async () => {
    if (!radio.checked) return;
    const style       = radio.value;
    const showTooltip = tooltipCheck.checked;
    chrome.storage.local.set({ readerStyle: style });

    const tab = await getActiveTab();
    if (tab) await sendToTab(tab, 'updateSettings', { style, showTooltip });

    // Update status label if mode is on
    if (mainToggle.checked) {
      const label = style === 'newspaper' ? 'Newspaper' : 'Academic Paper';
      statusText.textContent = `Mode: ON — ${label}`;
    }
  });
});

// ── Tooltip toggle ──
tooltipCheck.addEventListener('change', async () => {
  const showTooltip = tooltipCheck.checked;
  const style = document.querySelector('input[name="readerStyle"]:checked')?.value || 'academic';
  chrome.storage.local.set({ showTooltip });

  const tab = await getActiveTab();
  if (tab) await sendToTab(tab, 'updateSettings', { style, showTooltip });
});
