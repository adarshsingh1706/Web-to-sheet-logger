let saveButton = null;


console.log("Web-to-Sheet Logger content script loaded");


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
  // Clean up any existing button
  if (saveButton && document.body.contains(saveButton)) {
    document.body.removeChild(saveButton);
    saveButton = null;
  }

  //button
  saveButton = document.createElement('div');
  saveButton.id = 'web-to-sheet-save-container';
  saveButton.style.position = 'absolute';
  saveButton.style.top = `${e.pageY + 10}px`;
  saveButton.style.left = `${e.pageX}px`;
  saveButton.style.zIndex = '99999'; // Ensure it's above everything

  
  saveButton.innerHTML = `
    <div style="
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      font-family: 'Segoe UI', Arial, sans-serif;
      width: 280px;
      animation: fadeIn 0.2s ease-out;
    ">
      <h3 style="
        margin: 0 0 10px 0;
        color: #2e7d32;
        font-size: 16px;
        font-weight: 600;
      ">Save to Google Sheets</h3>
      
      <div style="margin-bottom: 12px;">
        <p style="margin: 6px 0; font-size: 14px;">
          <b>Selected Text:</b> 
          <span style="color: #333;">${selection.slice(0, 50)}${selection.length > 50 ? '...' : ''}</span>
        </p>
        <p style="margin: 6px 0; font-size: 13px; color: #666;">
          <b>From:</b> ${document.title.slice(0, 40)}${document.title.length > 40 ? '...' : ''}
        </p>
        <p style="margin: 6px 0; font-size: 12px; color: #888;">
          ${window.location.href.slice(0, 50)}${window.location.href.length > 50 ? '...' : ''}
        </p>
        <p style="margin: 6px 0; font-size: 12px; color: #666;">
          <b>Time:</b> ${metadata.timestamp}
        </p>
      </div>
      
      <button id="confirmSaveBtn" style="
        background: #2e7d32;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        width: 100%;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s;
      ">Confirm Save</button>
    </div>
  `;

 
  document.body.appendChild(saveButton);

  // Handle button click - using event delegation for reliability
  saveButton.addEventListener('click', function(btnEvent) {
    if (btnEvent.target.id === 'confirmSaveBtn') {
      btnEvent.stopPropagation();
      btnEvent.preventDefault();
      
      console.group('Saving Selection');
      console.log('Metadata:', metadata);
      console.groupEnd();
      
      // Show confirmation
      alert(`Saved to Sheets!\n\n"${selection.slice(0, 100)}${selection.length > 100 ? '...' : ''}"`);
      
      // Remove button
      if (saveButton && document.body.contains(saveButton)) {
        document.body.removeChild(saveButton);
        saveButton = null;
      }
    }
  });
}

// Handle text selection
document.addEventListener('mouseup', function(e) {
  const selection = window.getSelection().toString().trim();
  if (!selection || selection.length < 2) return; // Ignoring single character selections
  
  // Don't show if clicking on our own button
  if (e.target.closest('#web-to-sheet-save-container')) return;

  const metadata = {
    text: selection,
    url: window.location.href,
    title: document.title,
    timestamp: getTimestamp()
  };

  createSaveButton(e, selection, metadata);
});

// Closing button when clicking elsewhere
document.addEventListener('mousedown', function(e) {
  if (saveButton && 
      !e.target.closest('#web-to-sheet-save-container') && 
      document.body.contains(saveButton)) {
    document.body.removeChild(saveButton);
    saveButton = null;
  }
});

// Add some basic styles to the page
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);