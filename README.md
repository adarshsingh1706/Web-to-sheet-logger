# 🌐 Web-to-Sheet Logger – Chrome Extension  
*One-click saving of web highlights to Google Sheets*  
<br/>

---

## 🚀 Features  
🔍 Highlight any text → Save it along with metadata (URL, page title, timestamp)  
💫 Smooth, animated floating UI  
✅ Robust error handling & loading indicators  
☁️ Serverless backend using Google Apps Script  

---

## 🛠️ How We Built It

### 🔧 Tech Stack

| Component  | Technology Used                |
|------------|--------------------------------|
| Frontend   | Chrome Extension (Manifest V3) |
| Backend    | Google Apps Script             |
| Storage    | Google Sheets                  |
| CI/CD      | Manual ZIP deployment          |

---

### ⚔️ Challenges Faced & Solutions

#### 1. **CORS Restrictions**  
**Problem**: Chrome blocked fetch requests to Apps Script  
**Solution**:  
```js
// background.js proxy
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  fetch(request.url, { 
    headers: { "Origin": chrome.runtime.getURL("") } 
  })
  .then(res => res.json())
  .then(data => sendResponse(data));
  return true;
});
```

#### 2. **Manifest V3 Limitations**  
**Problem**: `webRequestBlocking` is not allowed  
**Workaround**: Used service worker messaging

---

## 📦 Installation

```bash
git clone https://github.com/yourusername/web-to-sheet-logger.git
# Create env file env.js
# Add your Apps Script URL to env.js
cd web-to-sheet-logger
npm install  # Optional: if using build tools
```

---

### 📁 Full Code Structure

**manifest.json**
```json
{
  "manifest_version": 3,
  "name": "Web-to-Sheet Logger",
  "version": "1.0",
  "permissions": ["activeTab", "scripting", "storage"],
  "background": {
    "service_worker": "background.js"
  }
}
```

**content.js**
```js
// Highlight detection and UI
document.addEventListener('mouseup', (e) => {
  const selection = window.getSelection().toString().trim();
  if (selection) createSaveButton(e, selection);
});

function createSaveButton(e, text) {
  const button = document.createElement('div');
  button.innerHTML = `
    <div class="save-container">
      <button id="saveBtn">💾 Save to Sheet</button>
    </div>
  `;
  document.body.appendChild(button);
}
```

---
## 📚 Usage

1. Highlight any text on a webpage.
2. Click the floating “💾 Save to Sheet” button.
3. The data is instantly sent to your linked Google Sheet.
4. Toasts confirm saving or duplication status.

## 🖼️ UI Preview

![Extension](/public/extension.png)  
![Save button](/public/save.png)  
![Loading state](/public/loading.png)  
![After saving toast](/public/saved.png)  
![Duplicate entry](/public/duplicate.png)

---
## ✅ Testing

- Load the extension in Chrome via `chrome://extensions`
- Enable "Developer Mode" → Load unpacked → Select your project folder
- Navigate to any webpage and try highlighting + saving

## 🌟 Highlights

- **Clean Architecture**: Clear separation between content scripts and background logic  
- **Privacy Focus**: No external servers – all data stays in the user's Google Sheet  
- **Polished UX**: Includes toast notifications and loading spinners for better feedback

---

## 🐞 Known Issues

🚫 Does not work on Chrome’s built-in PDF viewer tabs  
💤 First save may be slow due to Google Apps Script cold start

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check the [issues page](https://github.com/adarshsingh1706/Web-to-sheet-logger/issues) or submit a pull request.

## 🙏 Acknowledgements

- [Google Apps Script](https://developers.google.com/apps-script/)
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- <a href="https://www.flaticon.com/free-icons/bookmark" title="bookmark icons">Bookmark icons created by Freepik - Flaticon</a>
