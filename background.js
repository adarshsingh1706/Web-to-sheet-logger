chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "callAppsScript") {
    fetch(request.url, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Origin": chrome.runtime.getURL("")
      },
      body: JSON.stringify(request.data)
    })
    .then(res => res.json())
    .then(data => sendResponse(data))
    .catch(err => sendResponse({ error: err.message }));
    
    return true; 
  }
});