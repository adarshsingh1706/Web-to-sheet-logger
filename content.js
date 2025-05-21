console.log("Hello from content script");

let saveButton = null;

document.addEventListener('mouseup', (e) => {
  const selection = window.getSelection().toString().trim();
  

  if (saveButton) {
    saveButton.remove();
    saveButton = null;
  }

  if (selection) {
    console.log("Selected text:", selection);
    
    // Creating floating button
    saveButton = document.createElement('button');
    saveButton.textContent = 'Save to Sheet';
    saveButton.style.position = 'absolute';
    saveButton.style.top = `${e.pageY + 10}px`;
    saveButton.style.left = `${e.pageX}px`;
    saveButton.style.zIndex = '9999';
    saveButton.style.padding = '5px';
    saveButton.style.background = '#4285f4';
    saveButton.style.color = 'white';
    saveButton.style.border = 'none';
    saveButton.style.borderRadius = '4px';
    
    
    saveButton.addEventListener('click', () => {
      console.log("Saving:", selection);
      // Will add Google Sheets integration later
    });
    
    document.body.appendChild(saveButton);
  }
});

// remove button when clicked somwewhere else
document.addEventListener('mousedown', (e) => {
  if (saveButton && !saveButton.contains(e.target)) {
    saveButton.remove();
    saveButton = null;
  }
});