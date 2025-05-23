let saveButton = null;
let lastSavedText = '';

console.log("Web-to-Sheet Logger loaded");

function showToast(message, isSuccess) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 24px;
    background: ${isSuccess ? '#4CAF50' : '#F44336'};
    color: white;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 99999;
    animation: fadeIn 0.3s, fadeOut 0.3s 2.7s;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Loading spinner
function createSpinner() {
  const spinner = document.createElement('div');
  spinner.innerHTML = `
    <div style="
      border: 3px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top: 3px solid #2e7d32;
      width: 20px;
      height: 20px;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    "></div>
  `;
  return spinner;
}

function getTimestamp() {
  return new Date().toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

function createSaveButton(e, selection, metadata) {
  if (selection === lastSavedText) {
    showToast('You already saved this text!', false);
    return;
  }

  // Cleanup existing button
  if (saveButton) {
    saveButton.remove();
    saveButton = null;
  }

  //button
  saveButton = document.createElement('div');
  saveButton.id = 'web-to-sheet-save-container';
  saveButton.style.cssText = `
    position: absolute;
    top: ${e.pageY + 10}px;
    left: ${e.pageX}px;
    z-index: 99999;
    font-family: 'Segoe UI', system-ui, sans-serif;
  `;

  saveButton.innerHTML = `
    <div style="
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      width: 300px;
      animation: fadeIn 0.2s ease-out;
    ">
      <h3 style="
        margin: 0 0 12px 0;
        color:rgb(114, 46, 125);
        font-size: 17px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
      ">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#2e7d32">
          <path d="M17 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19z"/>
          <path d="M12 12c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-1-8h5v5h-2V6h-3V4z"/>
        </svg>
        Save to Google Sheets
      </h3>
      
      <div style="margin-bottom: 16px;">
        <p style="margin: 8px 0; font-size: 14px; line-height: 1.5;">
          <b style="color: #555;">Selected Text:</b> 
          <span style="color: #333;">${selection.slice(0, 50)}${selection.length > 50 ? '...' : ''}</span>
        </p>
        <div style="display: flex; gap: 12px; margin-top: 12px;">
          <div style="flex: 1;">
            <p style="margin: 6px 0; font-size: 13px; color: #666;">
              <b>Page:</b> ${document.title.slice(0, 25)}...
            </p>
            <p style="margin: 6px 0; font-size: 12px; color: #888; word-break: break-all;">
              ${new URL(window.location.href).hostname}
            </p>
          </div>
          <div style="flex: 1;">
            <p style="margin: 6px 0; font-size: 12px; color: #666;">
              <b>Time:</b> ${metadata.timestamp}
            </p>
          </div>
        </div>
      </div>
      
      <button id="confirmSaveBtn" style="
        background:rgb(125, 46, 118);
        color: white;
        border: none;
        padding: 10px 0;
        border-radius: 6px;
        width: 100%;
        font-size: 15px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      ">
        <span id="btnText">Confirm Save</span>
      </button>
    </div>
  `;

  document.body.appendChild(saveButton);

  const confirmBtn = saveButton.querySelector('#confirmSaveBtn');
  const btnText = saveButton.querySelector('#btnText');

  confirmBtn.addEventListener('click', async (btnEvent) => {
    btnEvent.stopPropagation();
    
    // Loading state
    confirmBtn.disabled = true;
    btnText.textContent = 'Saving...';
    confirmBtn.insertBefore(createSpinner(), btnText);
    
    try {
      const response = await chrome.runtime.sendMessage({
        type: "callAppsScript",
        url: ENV.APPS_SCRIPT_URL,
        data: metadata
      });

      if (response.error) throw new Error(response.error);
      
      showToast('Saved to Google Sheets!', true);
      lastSavedText = selection;
      
    } catch (error) {
      console.error('Save error:', error);
      showToast(`Failed: ${error.message}`, false);
    } finally {
      if (saveButton?.parentNode) {
        saveButton.remove();
        saveButton = null;
      }
    }
  });
}

// Handle text selection
document.addEventListener('mouseup', function(e) {
  const selection = window.getSelection().toString().trim();
  if (!selection || selection.length < 5) return;
  if (e.target.closest('#web-to-sheet-save-container')) return;

  createSaveButton(e, selection, {
    text: selection,
    url: window.location.href,
    title: document.title,
    timestamp: getTimestamp()
  });
});

// Close button when clicking elsewhere
document.addEventListener('mousedown', function(e) {
  if (saveButton && !e.target.closest('#web-to-sheet-save-container')) {
    saveButton.remove();
    saveButton = null;
  }
});

const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);